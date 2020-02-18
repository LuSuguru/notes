## 代理模式
当客户不方便直接访问一个对象或者不满足需要的时候，提供一个替身对象来控制对这个对象的访问，客户实际上访问的是替身对象。替身对象对请求做出一些处理之后，再把请求转交给本体对象

### 代理和本体接口的一致性
对于客户来说，代理对象和本体是一致的，代理接手请求的过程对于用户来说是透明的，用户并不清楚代理和本体的区别，因此：
- 用户可以放心地请求代理，他只关系是否能得到想要的结果
- 在任何使用本体的地方都可以替换成使用代理

用于 javaScript 是动态类型语言，我们可以通过 **鸭子类型** 来检测代理和本体是否都实现了相同的接口

如果代理对象和本体对象都为一个函数（函数也是对象），函数必然都能被执行，则可以认为它们也具有一致的 ”接口“

### 代理模式的类型
- 保护代理：控制不同权限的对象对目标对象的访问
- 虚拟代理：把一些开销很大的操作，延迟到真正需要它的时候才去创建
- 缓存代理：为一些开销大的运算结果提供暂时的缓存，在下次运算时，如果传递进来的参数跟之前一致，则可以直接返回前面存储的运算结果

### 实际应用
#### 虚拟代理实现图片预加载
当图片很大的时候，图片加载的时候往往有段时间会是一片空白，常见的做法是先用一张 loading 图片占位，然后用异步的方式加载图片，等图片加载好了再把它填充到 img 节点里，这种场景非常适合使用虚拟代理

本体对象
```javaScript
const myImage = (function () {
  const imgNode = document.createElement('img')
  document.body.appendChild(imgNode)

  return {
    setSrc(src) {
      imgNode.src = src
    }
  }
})
```

现在我们引入代理对象，增加占位图功能
```javaScript
const proxyImage = (function () {
  const img = new Image()

  img.onload = function () {
    myImage.setSrc(this.src)
  }

  return {
    // 接口一致性
    setSrc(src) {
      myImage.serSrc('file:// /C:/Users/svenzeng/Desktop/loading.gif')
      img.src = src
    }
  }
})()

proxyImage.setSrc('http:// imgcache.qq.com/music/photo/k/000GGDys0yA0Nk.jpg')
```

我们并没有改变或者增加 MyImage 的接口，但是通过代理对象，实际上给系统添加了新的行为
如果某一天我们不再需要预加载，那么只需要改成请求本体而不是请求代理对象即可

#### 虚拟代理在惰性加载中的应用
如果我们有一个异步库 miniConsole.js 需要异步加载，那么在 js 文件未加载之前，为了能够让用户正常地使用里面的 API，通常我们的解决方案是用一个占位的 miniConsole 代理对象来给用户提前使用，这个代理对象提供给用户的接口，跟实际的 miniConsole 的一样

未加载真正的 miniConsole.js 之前的代码：
```javaScript
let miniConsole = (function () {
  const cache = []

  // 加载真正的 miniConsole.js
  function handler(e) {
    if (e.keyCode === 113) {
      const script = document.createElement('script')
      script.onload = function () {
        cache.forEach(fn => fn())
      }

      script.src = 'miniConsole.js'

      document.getElementsByTagName('head')[0].appendChild(script)
      document.body.removeEventListener('keydown', handler)
    }
  }

  document.body.addEventListener('keydown', handler, false)

  return {
    log(...args) {
      cache.push(() => miniConsole.log.apply(miniConsole, args))
    }
  }
})()

miniConsole.log(1)
```

当用户按下 F12 时，开始加载真正的 miniConsole.js，代码如下：
``` javaScript
miniConsole = {
  log(...args) {
    // 示范
    console.log(args.join(,))
  }
}
```

#### 缓存代理的例子
这里我们通过缓存代理缓存传入的参数，当参数相同时可以避免不必要的计算

``` javaScript
const mult = (...args) => args.reduce((a, current) => a * current, 1)
const plus = (...args) => args.reduce(a, current => a + current, 0)

const createProxyFactory = (fn) => {
  const cache = {}

  return (...args) => {
    const argsStr = args.join(',')
    if (cache[argsStr]) {
      return cache[argsStr]
    }

    return cache[args] = fn(...args)
  }
}

const proxyMult = createProxyFactory(mult)
const proxyPlus = createProxyFactory(plus)

proxyMult(1, 2, 3)
proxyMult(1, 2, 3) // 使用缓存值

proxyPlus(1, 2)
proxyPlus(1, 2) // 使用缓存值
```

