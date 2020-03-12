## 装饰者模式
在传统的面向对象语言中，给对象添加功能常常使用继承的方式，但是继承的方式并不灵活，还会带来许多问题

### 继承的问题
- 导致超类和子类之间存在强耦合性，当超类改变时，子类也会随之改变
- 继承这种功能复用方式通常被称为“白箱复用”，“白箱”是相对可见性而言的，在继承方式中，超类的内部细节是对子类可见的，继承常常被认为破坏了封装性
- 在完成一些功能复用的同时，有可能创建出大量的子类，使子类的数量呈爆炸性增长

### 定义
**装饰者模式**可以在不改变对象自身的基础上，在程序运行期间给对象动态地添加职责

相较于继承，装饰者是一种更轻便灵活的做法，这是一种“即用即付”的方式

### 实现
- 在给对象动态增加职责的方式中，并没有改变目标对象本身，而是将目标对象放入一个个包装对象中，形成一条包装链，并返回包装后的对象
- 通过包装后的对象具有与目标相同的接口
- 请求随着这条包装链依次传递到所有的对象，每个对象都有处理这条请求的机会
- 当请求达到链中的某个对象时，这个对象会执行自身的操作，随后把请求转发给链中的下一个对象

```js
class Plane {
  fire() {
    console.log('发射普通子弹')
  }
}

class MissileDecorator() {
  constructor(plane) {
    this.plane = plane
  }

  fire() {
    this.plane.fire()
    console.log('发射导弹')
  }
}

class AtomDecorator() {
  constructor(plane) {
    this.plane = plane
  }

  fire() {
    this.plane.fire()
    console.log('发射原子弹')
  }
}

const plane = new AtomDecorator(new MissileDecorator(new Plane()))
plane.fire()
```

### javaScript 中的装饰者
由于**装饰者模式**的本质只是增加对象的功能，而在 js 中改写对象或者对象的某个方法非常容易，所以，我们并不需要“类”来实现装饰者模式，直接修改对象的方法即可

以上面那个例子为参考：
```js
const plane = {
  fire() {
    console.log('发射普通子弹')
  }
}

function missileDecorator() {
  console.log('发射导弹')
}

function atomDecorator() {
  console.log('发射原子弹')
}

const fire1 = plane.fire
plane.fire = function () {
  fire1()
  missileDecorator()
  atomDecorator()
}

plane.fire()
```

### 装饰函数
在 js 中，函数又被称为一等对象。所以，我们也可以通过**装饰函数**对函数进行包装，例如我们想要实现 AOP，在目标函数执行前，后增加一些额外的功能，实现代码如下：

```javascript
Function.prototype.before = function (beforefn) {
  const _self = this

  return function (...args) {
    beforefn.apply(this, args)
    return _self.apply(this, args)
  }
}

Function.prototype.after = function (afterfn) {
  const _self = this
  return function (...args) {
    const ret = _self.apply(this, ...args)

    afterfn.apply(this, ...args)
    return ret
  }
}
```

### AOP 的应用案例
AOP 即 **面向切面过程**，以 HTTP 的请求处理为例，不同的业务场景中，可能请求的处理不同，但是，它们有一些逻辑是相同的，例如数据上报，日志统计等，如果对于每个请求都增加这个逻辑，那么将降低代码的复用率

我们可以在这个请求的过程中做 N 个“横切面”，用来处理数据上报，日志统计等，如下图：

```js
             数据上报          日志统计
                |               |
接收 HTTP 请求 ------> 业务处理 ------> 返回结果
```

下面以数据上报为例，通过 AOP 分离之后，代码如下：
```js
function Login() {
  function showLogin() {
    console.log('打开登录浮层')
  }

  function log() {
    console.log('上报标签：tag')
  }

  const login = showLogin.after(log)

  function onClick() {
    login()
  }


  return (
    <button onClick={onClick}>点击打开登录浮层</button>
  )
}
```

#### 表单验证
在[策略模式](./strategy.md)中，我们通过**策略模式**重构了整个验证的代码，但是一个完整的表单提交，验证只是其中的一环，可能还会有参数格式化，ajax 请求等，我们可以把这些不同的逻辑也通过 AOP 组装出来，形成调用链：

```js
Function.prototype.before = function (beforefn) {
  const _self = this

  return function (...args) {
    // 使链式调用可以被打断
    if (beforefn.apply(this, ...args) === false) {
      return
    }

    return _self.apply(this, args)
  }
}

// 校验
function validata() {
  const validator = new Validator()

  validator.add(userName, [
    { strategy: 'isNonEmpty', errorMsg: '用户名不能为空' },
    { strategy: 'minLength:6', errorMsg: '用户名长度不能小于10位' }
  ])

  validator.add(password, [
    { strategy: 'minLength:6', errorMsg: '密码长度不能小于6位' }
  ])

  validator.add(phoneNumber, [
    { strategy: 'isMobile', errorMsg: '手机号码格式不正确' }
  ])

  const errorMsg = validator.start()
  return errorMsg;
}

// 发请求
function formFetch() {
  axios.post('http://xxx.com/login', { data: { userName, password, phoneNumber } })
}

const onSubmit = formFetch.before(validata)
```

### 装饰者模式和代理模式
装饰者模式和代理模式的结构看起来非常相像，这两种模式都描述了怎样为对象提供一定程度上的间接引用
，但是它们的意图和设计目的：

#### 代理模式
1. 更强调一种关系（Proxy 与它的实体之间的关系），这种关系可以在一开始就可以被确定
2. 当直接访问本体不方便或者不符合需要时，为这个本体提供一个替代者
3. 本体定义了关键功能，而代理提供或拒绝对它的访问，或者在访问本体之前做一些额外的事情

#### 装饰者模式
- 为对象动态加入行为
- 用于一开始不能确定对象的全部功能时
- 会形成一条长长的装饰链


