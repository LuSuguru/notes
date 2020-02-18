## 策略模式
定义一系列的算法，把它们一个个封装起来，并且使它们可以相互转化

### 实现
一个基于策略模式的程序至少由两部分组成：
1. 一组策略类：封装了具体的算法（或者一系列的”业务规则“），并负责具体的计算过程（算法的实现，**可变的**）
2. 环境类Context：Context 接受客户的请求，随后把请求委托给某一个策略类，要做到这点，说明 Context 中要维持对某个策略对象的引用（算法的使用，**不变的**）

### 实际应用（表单验证）
假设我们正在编写一个注册的页面，在点击提交按钮之前，有如下几条校验逻辑：
1. 用户名不能为空
2. 密码不能少于6位
3. 手机号码必须符合格式

#### 第一个版本
以下是第一个版本，问题有3个：
1. onSubmit 函数庞大，且包含很多 if-else 语句
2. 函数缺乏弹性，如果需要新增修改规则都要深入函数内部
3. 复用性差

```javaScript
function Form() {
  const [form, setForm] = useState({
    userName: '',
    password: '',
    phoneNumber: ''
  })
  const { userName, password, phoneNumber } = form

  const onChange = (key) => ({ target }) => {
    setForm((form) => ({
      ...form,
      [key]: target.value
    }))
  }

  const onSubmit = () => {
    if (userName === '') {
      alert('用户名不能为空')
      return false
    }

    if (password.length < 6) {
      alert('密码长度不能少于 6 位')
      return false
    }

    if (!/(^1[3|5|8][0-9]{9}$)/.test(phoneNumber)) {
      alert('手机号码格式不对')
      return false
    }
  }

  return (
    <>
      用户名：<input value={userName} onChange={onChange('userName')} />
      密码：<input value={password} onChange={onChange('password')} />
      手机号<input value={phoneNumber} onChange={onChange('phone')} />
      <button onClick={onSubmit}>提交</button>
    </>
  )
}
```

#### 用策略模式重构
这里的校验规则相当于是可变的策略类，如下：

```js
const strategies = {
  isNonEmpty: function (value, errorMsg) {
    if (value === '') {
      return errorMsg
    }
  },
  minLength: function (value, length, errorMsg) {
    if (value.length < length) {
      return errorMsg
    }
  },
  isMobile: function (value, errorMsg) {
    if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
      return errorMsg;
    }
  }
}
```

接下来我们需要一个 校验触发器用来做 Context，负责接收用户的请求并委托给 strategy 

```js
class Validator {
  constructor() {
    this.cache = []
  }

  add(value, rules) {
    rules.forEach((rule) => {
      const { strategy, errorMsg } = rule
      const strategyAry = strategy.split(':')

      this.cache.push(() => {
        const strategy = strategyAry.shift()

        return strategies[strategy](...[value, ...strategyAry, errorMsg])
      })
    })
  }

  start() {
    for (let i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
      const errorMsg = validatorFunc()
      if (errorMsg) {
        return errorMsg;
      }
    }
  }
}
```

最后我们只需要在 onSubmit 中注册校验规则并发起请求
```js
function validataFunc() {
  const validator = new Validator()

  validator.add(userName, [
    { strategy: 'isNonEmpty', errorMsg: '用户名不能为空' },
    { strategy: 'minLength:6', errorMsg: '用户名长度不能小于10位' }
  ])

  validator.add(registerForm.password, [
    { strategy: 'minLength:6', errorMsg: '密码长度不能小于6位' }
  ])

  validator.add(registerForm.phoneNumber, [
    { strategy: 'isMobile', errorMsg: '手机号码格式不正确' }
  ])

  const errorMsg = validator.start()
  return errorMsg;
}

function onSubmit() {
  const errorMsg = validataFunc()

  if (errorMsg) {
    alert(errorMsg)
    return false
  }
}
```

### 策略模式的优缺点
#### 优点：
- 利用组合、委托和多态等技术和思想，有效地减少了多重条件选择语句
- 提供了对 **开放-封闭原则** 的完美支持，将可变逻辑封装到独立的 strategy 中，使得它们易于切换，易于理解，易于扩展
- 提高了整体的复用性

#### 缺点：
- 增加代码量和代码的复杂程度
- 调用方必须熟悉所有的 strategy，必须了解各个 strategy 之间的不同点，这样才能选择一个合适的 strategy，因此，它必须暴露它的所有实现，这是违反 **最少知识原则** 的

### javascript 中的策略模式
在以类为中心的传统面向对象语言中，不同的算法或者行为被封装到各个策略类中， Context 将请求委托给这些策略对象，这些策略对象会根据请求返回不同的执行结果，这样便能表现出对象的多态性

然而，在 javaScript 中，函数是 **一等公民**，策略模式是隐形的，strategy 就是值为函数的变量

我们在用高阶函数来封装不同的行为时，
- 传递的函数相当于一个独立的 strategy
- 高阶函数相当于 context
- 当我们调用函数时，不同的函数会返回不同的执行结果





