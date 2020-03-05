## 职责链模式
### 定义
使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系，将这些对象连成一条链，并沿着这条链传递该请求

```js
请求 --> A --> B --> C --> D
```

#### 实际应用
假设我们负责一个售卖手机的电商站点，经过粉笔交纳500元定金和200元定金的两轮预定后，在正式购买后，已经支付过500元定金的用户会收到100元的商城优惠券，200元定金的用户可以收到50元的优惠券，而之前没有支付定金的用户只能进入普通购买模式

我们定义3个字段：
- orderType:1.500元定金 2.200元定金 3.普通购买用户
- pay:是否已经支付定金，ture or false
- stock: 库存数量，只对普通购买的增加限制

以下是第一版的实现，这版难以阅读，并且经常需要进行修改：
```js
function order(orderType, pay, stock) {
  if (orderType === 1) {
    if (pay) {
      console.log('500元定金预约，得到100元优惠券')
    } else {
      if (stock > 0) {
        console.log('普通购买，无优惠券')
      } else {
        console.log('手机库存不足')
      }
    }
  } else if (orderType === 2) {
    if (pay) {
      console.log('200元定金预约，得到50元优惠券')
    } else {
      if (stock > 0) {
        console.log('普通购买，无优惠券')
      } else {
        console.log('手机库存不足')
      }
    }
  } else if (orderType === 3) {
    if (stock > 0) {
      console.log('普通购买，无优惠券')
    } else {
      console.log('手机库存不足')
    }
  }
}

order(1, true, 500)
```

第二版，我们把 500元订单、200元订单以及普通购买分成3个函数，跟第一版相比，这版的结构已经清晰了很多，但是它还有一个问题，*链条传递中的顺序非常僵硬，传递请求的代码都被耦合在了业务函数之中*，假设我们要增加一个300元预定或者去掉200元预定，就要改动这些业务函数内部：
```js
function order500(orderType, pay, stock) {
  if (orderType === 1 && pay) {
    console.log('500元定金预购，得到100元优惠券')
  } else {
    order200(orderType, pay, stock)
  }
}

function order200(orderType, pay, stock) {
  if (orderType === 2 && pay) {
    console.log('200元定金预购，得到50元优惠券')
  } else {
    orderNormal(orderType, pay, stock)
  }
}

function orderNormal(orderType, pay, stock) {
  if (stock > 0) {
    console.log('普通购买，无优惠券')
  } else {
    console.log('手机库存不足')
  }
}
```

在第三版中，我们把链条的连接独立业务出来，让链中的各个节点可以灵活拆分和重组：

```js
// 链条对象
class Chain {
  constructor(fn) {
    this.fn = fn
    this.successor = null
  }

  setNextSuccessor(successor) {
    return this.successor = successor
  }

  passRequest(...args) {
    const ret = this.fn.apply(this, args)

    if (ret === 'nextSucessor') {
      return this.successor && this.successor.passRequest.apply(this.successor, args)
    }
  }
}

function order500(orderType, pay, stock) {
  if (orderType === 1 && pay) {
    console.log('500元定金预购，得到100元优惠券')
  } else {
    return 'nextSuccessor'
  }
}

function order200(orderType, pay, stock) {
  if (orderType === 2 && pay) {
    console.log('200元定金预购，得到50元优惠券')
  } else {
    return 'nextSuccessor'
  }
}

function orderNormal(orderType, pay, stock) {
  if (stock > 0) {
    console.log('普通购买，无优惠券')
  } else {
    console.log('手机库存不足')
  }
}

// 将3个订单函数分别包装成职责链的节点
const chainOrder500 = new Chain(order500)
const chainOrder200 = new Chain(order200)
const chainOrderNormal = new Chain(orderNormal)

// 指定顺序
chainOrder500.setNextSuccessor(chainOrder200)
chainOrder200.setNextSuccessor(chainOrderNormal)

chainOrder500.passRequest(1, true, 500)
```

第三版的职责链模式已经比较完整了，但是如果链中出现了一些异步情况，此时直接 `return 'nextSuccessor'`是没有意义的，所以我们对 Chain 增加一个 next 方法，用于异步传递：

```js
class Chain {
  constructor(fn) {
    this.fn = fn
    this.successor = null
  }

  setNextSuccessor(successor) {
    return this.successor = successor
  }

  passRequest(...args) {
    const ret = this.fn.apply(this, args)

    if (ret === 'nextSucessor') {
      return this.successor && this.successor.passRequest.apply(this.successor, args)
    }
  }

  next() {
    return this.successor && this.successor.passRequest.apply(this.successor, args)
  }
}

const fn1 = new Chain(function () {
  console.log(1)
  return 'nextSuccessor'
})

const fn2 = new Chain(function () {
  console.log(2)
  setTimeout(() => {
    this.next()
  }, 1000)
})

fn1.setNextSuccessor(fn2)
fn1.passRequest()

```

### 职责链模式的优缺点
优点：
- 节点里各自的处理函数相互独立，互不影响
- 链中的节点对象可以灵活地拆分重组。增加、删除、移动某个节点都是非常容易的事情，且不会对业务逻辑进行破坏
- 可以手动指定起始节点，请求并不是非得从链中的第一个节点开始传递

缺点：
- 不能保证某个请求一定会被链中的节点处理，最好是有一个尾节点兜底
- 另外，一些节点在某一次的请求传递过程中，不一定会使用到，它们的作用仅仅是让请求传递下去，从性能考虑，我们要避免过长的职责链带来的性能损耗

### AOP
AOP意为面向切面编程，提倡从横向切面思路向管道某个位置插入一段代码逻辑，这样就实现在任何业务逻辑前后都有相同代码逻辑段，通过 AOP 我们也可以实现职责链

```js
Function.prototype.after = function (fn) {
  return (...args) => {
    const ret = this.apply(this, args)

    if (ret === 'nextSuccessor') {
      return fn.apply(this, arguments)
    }

    return ret
  }
}

const order = order500yuan.after(order200yuan).after(orderNormal)
```
