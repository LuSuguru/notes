## 发布-订阅模式
它定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知

### 发布-订阅模式的作用
- *在时间上进行解耦*：可以广泛应用于**异步编程**，在**异步编程**中使用发布-订阅模式，我们就无需过多关注对象在异步运行期间的内部状态，而只需要订阅感兴趣的事件发生点，
- *在对象间进行解耦*：发布-订阅模式可以取代对象之间硬编码的通知机制，一个对象不用再显式地调用另外一个对象的某个接口，两个对象松耦合地联系在一起，

### 实现
1. 指定好谁充当发布者
2. 给发布者添加一个缓存列表，用于存放回调函数以便通知订阅者
3. 发布信息的时候，发布者会遍历这个缓存列表，依次触发里面存放的订阅者回调函数

#### 观察者
在发布-订阅模式中，如果订阅者知道发布者的存在，它们之间是有关联的，也被称为**观察者模式**

```javascript
// 通用的 event
const event = {
  clientList: {},

  listen(key, fn) {
    if (!this.clientList[key]) {
      this.clientList[key] = []
    }
    // 订阅的消息添加到缓存列表
    this.clientList[key].push(fn)
  },

  trigger(...args) {
    const key = args.shift()
    fns = this.clientList[key]

    if (!fns || fns.length === 0) {
      return false
    }

    for (let i = 0, fn; fn = fns[i++];) {
      fn.apply(this, ...args)
    }
  },

  remove(key, fn) {
    const fns = this.clientList[key]

    if (!fns) {
      return false
    }

    if (!fn) {
      fns && (fns.length = 0)
    } else {
      const index = fns.findIndex((_fn) => _fn === fn)

      if (index !== -1) {
        fns.splice(index, 1)
      }
    }
  }
}

// 给某个对象增加 event
const injectEvent = function (obj) {
  for (let i in event) {
    obj[i] = event[i]
  }
}

// subject 成发布者
const subject = {}
injectEvent(subject)

// 订阅
subject.listen('class1', (time) => {
  console.log(`课程时间：${time}`)
})

subject.trigger('class1', 45)
```

#### 发布-订阅
不同于 **观察者**，**发布-订阅**的实现可以用一个全局的 Event 对象来实现，订阅者不需要了解消息来自哪个发布者，发布者也不知道消息会推送给哪些订阅者，Event 作为一个类似"中介者"的角色，把订阅者和发布者联系起来

```javascript
const event = (function () {
  const clientList = {}

  function listen(key, fn) {
    if (!clientList[key]) {
      clientList[key] = []
    }
    // 订阅的消息添加到缓存列表
    clientList[key].push(fn)
  }

  function trigger(...args) {
    const key = args.shift()
    fns = clientList[key]

    if (!fns || fns.length === 0) {
      return false
    }

    for (let i = 0, fn; fn = fns[i++];) {
      fn.apply(this, ...args)
    }
  }

  function remove(key, fn) {
    const fns = this.clientList[key]

    if (!fns) {
      return false
    }

    if (!fn) {
      fns && (fns.length = 0)
    } else {
      const index = fns.findIndex((_fn) === _fn === fn)

      if (index !== -1) {
        fns.splice(index, 1)
      }
    }
  }

  return { listen, trigger, remove }
})()


Event.listen('class1', (time) => {
  console.log(`课程时间：${time}`)
})

Event.trigger('class1', 45)
```

*注意：模块之间如果用了太多的发布-订阅模式来通信，那么模块与模块之间的关系就被隐藏到了背后，我们不清楚消息来自哪，去向哪，导致难以维护*

### 完整的发布-订阅实现
在某些情况下，我们需要 Event 对象具备先发布后订阅的能力，另外，我们还可以给 Event 对象提供创建命名空间的功能

完整的实现如下，通过闭包封装了一个用于创建命名空间的 create 函数：

```javaScript
const Event = (function () {
  const each = (array, fn) => array.map((item, index) => fn(item, index))

  function _Event() {
    const namespaceCache = {}

    function _listen(key, fn, cache) {
      if (!cache[key]) {
        cache[key] = []
      }
      cache[key].push(fn)
    }

    function _remove(key, cache, fn) {
      if (cache[key]) {
        cache[key] = fn
          ? cache[key] = cache[key].filter((_fn) === _fn !== fn)
          : []
      }
    }

    function _trigger(cache, key, ...args) {
      const stack = cache[key]

      if (!stack || !stack.length) {
        return
      }

      return each(stack, (fn) => {
        fn.apply(this, args)
      })
    }

    function create(namespace = 'default') {
      const cache = {}
      let offlineStack = [] // 离线事件

      ret = {
        listen(key, fn, last) {
          _listen(key, fn, cache)

          if (offlineStack === null) {
            return
          }

          // 释放存储的离线事件
          if (last === 'last') {
            offlineStack.length && offlineStack.pop()()
          } else {
            each(offlineStack, (_fn) => {
              _fn()
            })
          }

          offlineStack = null
        },

        one(key, fn, last) {
          _remove(key, cache)
          this.listen(key, fn, last)
        },

        remove(key, fn) {
          _remove(key, cache, fn)
        },

        trigger(...args) {
          const fn = () => _trigger.apply(this, [cache, ...args])

          if (offlineStack) {
            offlineStack.push(fn)
          }

          return fn()
        }
      }

      return namespace
        ? (namespaceCache[namespace] ? namespaceCache[namespace] : namespaceCache[namespace] = ret)
        : ret
    }

    return {
      create,
      one(key, fn, last) {
        const event = create()
        event.one(key, fn, last)
      },
      remove(key, fn) {
        const event = create()
        event.remove(key, fn)
      },
      listen(key, fn, last) {
        // debugger
        const event = create()
        event.listen(key, fn, last)
      },
      trigger(...args) {
        const event = create()
        event.trigger(...args)
      }
    }
  }

  return _Event()
})()


Event.create('namespace1').listen('click', function (a) {
  console.log(a)
})
Event.create('namespace1').trigger('click', 1)


Event.create('namespace2').listen('click', function (a) {
  console.log(a)
})
Event.create('namespace2').trigger('click', 2)
```

### javaScript 实现发布-订阅的优势
在 Java 中实现一个自己的发布-订阅模式，通常会把订阅者对象自身当成引用传入发布者对象中，同时订阅者对象还需要提供一个名为 update 的方法，拱发布者对象在适合的时候调用，而在 javaScript 中，我们用注册回调函数的形式来代替传统的发布-订阅模式，显得更加优雅和简单


