## 单例模式
保证一个类仅有一个实例，并提供一个访问它的全局访问点

### 实现
用一个变量来标志当前是否已经为某个类创建过对象，如果是，则在下一次获取该类的实例时，直接返回之前创建的对象

```js
class Singleton {
  constructor(name) {
    this.name = name
    this.instance = null
  }

  getName() {
    alert(this.name)
  }

  getInstance(name) {
    if (!this.instance) {
      this.instance = new Singleton(name)
    }
    return this.instance
  }
}

const a = Singleton.getInstance('sven1')
```

上述的实现非常简单，但是增加了这个类的 **不透明性**，Singleton 类的使用者必须知道这是一个单例类，且必须使用 getInstance 来获取对象

### 透明的单例模式
为了解决上述的问题，我们改造了上述代码，用户从这个类中创建对象的时候，可以像使用其他任何普通类一样，**单例** 对于用户而言是透明的

```js
class Singleton {
  constructor(name) {
    if (!Singleton.instance) {
      this.name = name

      Singleton.instance = this
    }
    return Singleton.instance
  }

  getName() {
    alert(this.name)
  }
}

const a = new Singleton('sven1')
const b = new Singleton('sven2')
alert(a === b); // true
```

### javaScript 中的单例模式
javaScript 是一门无类的语言，生搬单例模式的概念并无意义

在 javaScript 中创建对象的方法非常简单，既然我们只需要一个 **唯一** 的对象，只需要把某个全局变量当成单例来使用

现代 javaScript 应用都是模块化应用。所以，也不存在全局命名空间冲突的问题

``` javascript
    const a = {}
```

### 惰性单例
采用对象字面量创建单例只能适用于简单的应用场景

一旦该对象十分复杂，那么创建对象本身就需要一定的耗时，且该对象可能有一些复杂的逻辑

此时，可以采用 **惰性单例**，在真正需要的时候才创建对象实例

整个 **惰性单例** 的实现分为两步：
1. 创建对象 
2. 管理单例

对于1，它是可变的，不同的对象的创建方式都是不相同的

对于2，它是不可变的部分，可以抽象化，我们可以封装一个 **管理单例** 的函数，如下

```js
function getSingle(fn) {
  var result
  return function (...args) {
    return result || (result = fn.apply(this, args))
  }
}
```

#### 例子
假设现在某个页面需要一个弹窗，那么这个弹窗应该是全局且唯一的，通过 **惰性单例** 的实现如下：

```js
const createSingleLoginLayer = getSingle(function () {
  const div = document.createElement('div')
  div.innerHTML = '登录弹窗'
  div.style.display = 'none'

  document.body.appendChild(div)
  return div
})

document.getElementById('loginBtn').onclick = () => {
  var loginLayer = createSingleLoginLayer()
  loginLayer.style.display = 'block'
}
```

如果我们需要一个唯一的 iframe 用于动态加载第三方页面：

```js
const createSingleIframe = getSingle(function () {
  var iframe = document.createElement('iframe')
  document.body.appendChild(iframe)

  return iframe
})

document.getElementById('loginBtn').onclick = () => {
  const loginLayer = createSingleIframe()
  loginLayer.src = 'http://baidu.com'
}
```





