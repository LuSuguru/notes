## 命令模式
执行某些特定事件的指令

### 定义
有时候需要向某些对象发送请求，但是并不知道请求的接收者是谁，也不知道被请求的操作是什么，此时希望用一种松耦合的方式来设计程序，使得请求发送者和请求接收者能够消除彼此之间的耦合关系

相对于过程化的请求调用，command 对象拥有更长的生命周期。对象的生命周期是跟初始请求无关的，因为这个请求已经被封装在了 command 对象的方法中，成为了这个对象的行为。我们可以在程序运行的任意时刻去调用这个方法

### 实现
- 将过程式的请求调用封装在 command 对象里
- command 对象可以被四处传递，接收者通过 command 对象发送请求

### javaScript 中的命令模式
假设现在用户界面有 N 个 button，部分程序员负责绘制这些 button，另外一些程序员负责编写点击按钮后的逻辑，对于绘制按钮的程序员来说，他并不知道某个 button 将来用来做什么，此时可以在这里运用命令模式：
- 点击 button 之后，必须向某些负责具体行为的对象发送请求，这些对象就是请求的接收者
- 我们需要借助命令对象的帮助，以便解开按钮和负责具体行为对象之间的耦合

如下图，就是一个命令模式的实现例子

```jsx
// 接收者
const MenuBar = {
  update() {
    console.log('更新菜单页面')
  },
  undo(time) {
    console.log(`回滚到${time}前`)
  }
}

// 封装命令对象
const MenuBarCommand = (receiver) => {
  let lastTime = new Date()

  return {
    execute() { // 执行
      lastTime = new Date()
      receiver.update()
    },
    undo(time = lastTime) { // 撤销
      receiver.undo(time)
    }
  }
}

const menuBarCommnad = MenuBarCommand(MenuBar)

function Component() {
  const commandStack = useRef([])

  const setCommand = (commands, type) => () => {
    const command = commands[type]

    if (command) {
      command()
      commandStack.current.push(command)
    }
  }

  // 重做
  const onReplay = () => {
    let command

    while (command = commandStack.shift()) {
      command()
    }
  }

  return (
    <>
      <button onClick={setCommand(menuBarCommnad, 'execute')}>更新</button>
      <button onClick={setCommand(menuBarCommnad, 'undo')}>撤销</button>
      <button onClick={onReplay}>重做</button>
    </>
  )
}
```

### 宏命令
宏命令是一组命令的集合，通过执行宏命令的方式，可以一次执行一批命令

```jsx
const openCommand = {
  execute() {
    console.log('打开迅雷')
  }
}

const downloadCommand = {
  execute() {
    console.log('下载')
  }
}

const watchCommand = {
  execute() {
    console.log('观看')
  }
}

const MacroCommand = () => {
  const commandList = []

  return {
    add(command) {
      commandList.push(command)
    },
    execute() {
      commandList.forEach((command) => command.execute())
    }
  }
}

const macroCommand = MacroCommand()

macroCommand.add(openCommand)
macroCommand.add(downloadCommand)
macroCommand.add(watchCommand)

macroCommand.execute()
```

### 智能命令与傻瓜命令
- 傻瓜命令：命令模式都会在 command 对象中保存一个接收者来负责真正执行客户的请求，它只负责把客户的请求转交给接收者来执行，尽可能地得到了解耦，如上述例子中的`menuBarCommnad`
- 智能命令：command 对象可以直接实现请求，如上述例子中的`watchCommand`

### 策略模式与命令模式的区别
**策略模式** 指向的问题域更小，所有策略对象的目标总是一致的，它们只是达到这个目标的不同手段，它们内部的实现是针对“算法”而言的

**命令模式** 指向的问题域更广，command 对象解决的目标更具发散性。命令模式还可以完成撤销、排队等功能



