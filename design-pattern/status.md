## 状态模式

### 定义
- 将状态封装成独立的类，跟此种状态有关的行为都被封装到这个类的内部，即定义一些共同的行为方法，当对象的内部状态改变时，会带来不同的行为变化
- 我们使用的对象称为 Context，将状态对象注册到 Context 中，Context 最终会将请求委托给状态对象的行为方法

### 实际应用
#### 点灯案例
假设我们现在有个电灯，它有3种状态，弱光，强光，关闭，第一次是弱光，第二次是强光，第三次才是关闭点灯，以下是第一版的代码实现：

它的确定很明显：
1. `buttonWasPressed` 及其不稳定，每一次新增或者修改 light 的状态都要改动 `buttonWasPressed` 
2. 所有的状态相关的行为都在 `buttonWasPressed`中，如果以后这个点灯增加了状态，那么这个方法将异常庞大
3. 状态的切换非常不明显，极容易遗漏，也不能一目了然地明白点灯有多少种状态

```js
class Light {
  constructor() {
    this.state = 'off'
    this.button = null
  }

  init() {
    const button = document.createElement('button')
    button.innerHTML = '开关'

    this.button = document.body.appendChild(button)
    this.button.onClick = () => {
      this.buttonWasPressed()
    }
  }

  buttonWasPressed() {
    if (this.state === 'off') {
      console.log('弱光')
      this.state = 'weakLight'
    } else if (this.state === 'weakLight') {
      console.log('强光')
      this.state = 'strongLight'
    } else if (this.state === 'strongLight') {
      console.log('关灯')
      this.state = 'off'
    }
  }
}
```

下面我们根据 `状态模式` 改造，先定义三个状态类，OffLightState, WeakLightState, StrongLightState

```js
class State {
  buttonWasPressed() {
    throw new Error('父类的 buttonWasPressed 方法必须被重写')
  }
}

class OffLightState extends State {
  constructor(light) {
    this.light = light
  }

  buttonWasPressed() {
    console.log('弱光')
    this.light.setState(this.light.weakLightState)
  }
}

class WeakLightState extends State {
  constructor(light) {
    this.light = light
  }

  buttonWasPressed() {
    console.log('强光')
    this.light.setState(this.light.strongLightState)
  }
}

class StrongLightState extends State {
  constructor(light) {
    this.light = light
  }

  buttonWasPressed() {
    console.log('关灯')
    this.light.setState(this.light.offLightState)
  }
}
```

接下来改写 Light 
```js
class Light {
  constructor() {
    // 状态对象
    this.offLightState = new OffLightState(this)
    this.weakLightState = new WeakLightState(this)
    this.strongLightState = new StrongLightState(this)

    this.button = null
  }

  init() {
    const button = document.createElement('button')
    button.innerHTML = '开关'

    this.button = document.body.appendChild(button)
    this.currState = this.offLightState // 设置当前状态

    this.button.onClick = () => {
      // 委托给状态对象执行
      this.currState.buttonWasPressed()
    }
  }

  setState(newState) {
    this.currState = newState
  }
}
```

#### 文件上传
我们对于一个上床的文件，有两个按钮，一个用于暂停和继续上传，一个用于删除文件
- 文件在扫描过程中，是不能进行任何操作的
- 上传过程中，可以暂停和继续上传
- 扫描和上传过程中，点击删除按钮无效，只有在暂停、上传完成、上传失败之后，才能删除文件

我们先模拟一个上传插件
```js
const plugin = (function () {
  const plugin = document.createElement('embed')
  plugin.style.display = 'none'
  plugin.type = 'application/txftn-webkit'

  plugin.sign = () => {
    console.log('开始文件扫描')
  }

  plugin.pause = () => {
    console.log('暂停文件上传')
  }

  plugin.uploading = () => {
    console.log('开始文件上传')
  }

  plugin.del = () => {
    console.log('删除文件上传')
  }

  plugin.done = () => {
    console.log('文件上传完成')
  }

  document.body.appendChild(plugin)
  return plugin
})()
```

以下是 upload 组件的代码：

```js
function Upload(props) {
  const [state, setState] = useState('sign')
  const [text1, setText1] = useState('扫描中')
  const [text2, setText2] = useState('删除')

  // 注册回调方法
  window.external.upload = function (state) {
    changeState(state)
  }

  function changeState(state) {
    setState(state)
    switch (state) {
      case 'sign':
        plugin.sign()
        setText1('扫描中，任何操作无效')
        break
      case 'uploading':
        plugin.uploading()
        setText1('正在上传，点击暂停')
        break
      case 'pause':
        plugin.pause()
        setText1('已暂停，点击继续上传')
        break
      case 'done':
        plugin.done()
        setText1('上传完成')
        break
      case 'error':
        setText1('上传失败')
        break
      case 'del':
        plugin.del()
        console.log('删除完成')
      default:
        break
    }
  }

  onAction() {
    switch (state) {
      case 'sign':
        console.log('扫描中，点击无效...')
        break
      case 'uploading':
        changeState('pause')
        break
      case 'pause':
        changeState('uploading')
        break
      case 'done':
        console.log('文件已完成上传，点击无效')
        break
      case 'error':
        console.log('文件上传失败，点击无效')
        break
    }
  }

  onDelete() {
    switch (state) {
      case 'done':
      case 'error':
      case 'pause':
        changeState('del')
        break
      case 'sign':
        console.log('文件正在扫描中，不能删除')
        break
      case 'uploading':
        console.log('文件正在上传中，不能删除')
        break
    }
  }

  return (
    <>
      <span>{props.fileName}</span>
      <button onClick={onAction}>{text1}</button>
      <button onClick={onDelete}>{text2}</button>
    </>
  )
}
```

下面用状态模式改版：
```js
function Upload(props) {
  const [state, setState] = useState('sign')
  const [text1, setText1] = useState('扫描中')
  const [text2, setText2] = useState('删除')

  // 注册回调方法
  window.external.upload = function (state) {
    changeState(state)
  }

  // 状态机
  const status = {
    sign: {
      click1() {
        console.log('扫描中，点击无效...')
      },
      click2() {
        console.log('文件正在扫描中，不能删除')
      }
    },
    uploading: {
      click1() {
        changeState('pause')
      },
      click2() {
        console.log('文件正在上传中，不能删除')
      }
    },
    pause: {
      click1() {
        changeState('uploading')
      },
      click2() {
        changeState('del')
      }
    },
    done: {
      click1() {
        console.log('文件已完成上传，点击无效')
      },
      click2() {
        changeState('del')
      }
    },
    error: {
      click1() {
        console.log('文件上传失败，点击无效')
      },
      click2() {
        changeState('del')
      }
    }
  }

  function changeState(state) {
    setState(state)

    switch (state) {
      case 'sign':
        plugin.sign()
        setText1('扫描中，任何操作无效')
        break
      case 'uploading':
        plugin.uploading()
        setText1('正在上传，点击暂停')
        break
      case 'pause':
        plugin.pause()
        setText1('已暂停，点击继续上传')
        break
      case 'done':
        plugin.done()
        setText1('上传完成')
        break
      case 'error':
        setText1('上传失败')
        break
      case 'del':
        plugin.del()
        console.log('删除完成')
      default:
        break
    }
  }

  onAction() {
    status[state].click1()
  }

  onDelete() {
    status[state].click2()
  }

  return (
    <>
      <span>{props.fileName}</span>
      <button onClick={onAction}>{text1}</button>
      <button onClick={onDelete}>{text2}</button>
    </>
  )
}
```

### 状态模式的优缺点

#### 优点
1. 状态模式定义了状态与行为之间的关系，并将它们封装在一个类里。通过增加新的状态类，很容易增加新的状态和转换
2. 避免 Context 无限膨胀，状态切换的逻辑被分布在状态类中，也去掉了 Context 中原本过多的条件分支
3. 使状态的切换更加一目了然
4. Context 中的请求动作和状态类中封装的行为可以非常容易地独立变化而互不影响

#### 缺点
- 会定义许多状态类（可以使用键值对，不使用对象的方式避免）
- 逻辑会分散

### 状态模式的性能优化点
在通过使用 state 对象来执行状态模式时，state 对象的开销是性能优化的核心，有三种方法可以优化：

1. 一开始就创建好所有的状态对象，并且始终不销毁它们（节省时间）
2. 仅当 state 对象被需要时才创建并随后被销毁（节省空间）
3. 通过享元模式创建 state 对象（节省空间）

### 状态模式和策略模式的关系

#### 相同点
都有一个上下文、一些策略或者状态类，上下文把请求委托给这些类来执行

#### 不同点
**策略模式** 中的各个策略类之间是平等又平行的，它们之间没有任何联系，所以客户必须熟知这些策略类的作用，以便客户可以随时主动切换算法

**状态模式** 中状态和状态对应的行为是早已被封装好的，状态之间的切换也早被规定完成，“改变行为”这件事情发生在状态模式内部。对客户来说，并不需要了解这些细节