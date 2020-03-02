## 组合模式
回顾 [命令模式](./command.md) 中**宏命令**部分，宏命令中包含了一组子命令，它们组成了一个树形结构，其中，macroCommand 被称为组合对象，openCommand、downloadCommand、watchCommand 都是叶对象

```js
             ---> openCommand
macrocommand ---> downloadCommand
             ---> watchCommand
```

### 实现
1. 组合模式不是父子关系：组合模式是一种 HAS-A(聚合)的关系，而不是IS-A
2. 对叶对象操作的一致性：组合模式除了要求组合对象和叶对象拥有相同的接口之外，还有一个必要条件，就是对一组叶对象的操作必须具有一致性
3. 双向映射关系：组合模式适用于一对多，不适用于多对多
4. 提高组合模式性能：如果节点数量过多，在遍历树的过程中，性能方面也许表现得不够理想。有时候我们可以借助一些技巧，在实际操作中避免遍历整棵树

### 作用
组合模式将对象组合成树形结构，以表示“部分-整体”的层次结构。除了用来表示树形结构之外，组合模式的另一个好处是通过对象的多态性表现，使得用户对单个对象和组合对象的使用具有一致性

- **表示树形结构**
- **利用对象多态性统一对待组合对象和单个对象**

### 具体案例

#### 增强的宏命令
我们对先前的 **宏命令** 进行扩展：

```js
const openTvCommand = {
  execute() {
    console.log('打开电视')
  }
}

const openSoundCommand = {
  execute() {
    console.log('打开音响')
  }
}

const marcoCommand1 = MacroCommand()
macroCommand1.add(openTvCommand)
macroCommand1.add(openSoundCommand)

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

const macroCommand2 = MacroCommand()

macroCommand2.add(openCommand)
macroCommand2.add(downloadCommand)
macroCommand2.add(watchCommand)

const macroCommand = MacroCommand()
macroCommand.add(openAcCommand)
macroCommand.add(macroCommand1)
macroCommand.add(macroCommand2)

macroCommand.execute()
```

我们先组合了 macroCommand1，macroCommand2 两棵子树，然后将组合的树再组合，这棵树的结构可以支持任意多的复杂度。在这棵树最终被构造完成之后，让整棵树最终运转起来的步骤也非常简单，调用上层对象的 execute 方法，就会对整个树进行深度优先的搜索

#### 扫描文件夹
文件夹和文件的之间的关系，非常适合用组合模式来描述：文件夹里既可以包含文件，又可以包含其他文件夹，最终可能组合成一棵树

实现的代码如下：
```js
class Floder() {
  constructor(name) {
    this.name = name
    this.files = []
  }

  add(file) {
    this.files.push(file)
  }

  scan() {
    console.log('开始扫描文件夹：' + this.name)
    files.forEach((file) => file.scan())
  }
}

class File() {
  constructor(name) {
    this.name = name
  }

  add() {
    throw new Erro('文件下面不能再添加文件')
  }

  scan() {
    console.log('开始扫描文件：' + this.name)
  }
}

const folder1 = new Folder('视频')
const folder2 = new Folder('书籍')
const folder3 = new Folder('图片')

const file1 = new File('视频文件1')
const file2 = new File('书籍文件2')
const file3 = new File('图片文件3')

folder1.add(file1)
folder2.add(file2)
folder3.add(file3)

const folder = new Floder('D')
folder.add(folder1)
folder.add(folder2)
folder.add(folder3)

// 扫描
folder.scan()
```

### 透明性带来的安全问题
为了防止往叶对象中添加子节点出现的错误，我们可以给叶对象也添加 add 方法，并且在调用这个方法时，抛出一个异常来及时提醒，代码如下：

```js
const openTvCommand = {
  execute() {
    console.log('打开电视')
  },
  add() {
    throw new Error('叶对象不能添加子节点')
  }
}
```

### 引用父对象
有时候我们需要在子节点上保持对父节点的引用，现在来改写扫描文件夹的代码，使得在扫描整个文件夹之前，我们可以先移除某一个具体的文件

```js
class Floder() {
  constructor(name) {
    this.name = name
    this.files = []
    this.parent = null // 引用的父节点
  }

  add(file) {
    file.parent = this // 设置父对象
    this.files.push(file)
  }

  scan() {
    console.log('开始扫描文件夹：' + this.name)
    files.forEach((file) => file.scan())
  }

  remove() {
    // 根节点或者树外的游离节点
    if (!this.parent) {
      return
    }

    const files = files.filter((item) => item === this)
  }
}

class File() {
  constructor(name) {
    this.name = name
  }

  add() {
    throw new Erro('文件下面不能再添加文件')
  }

  scan() {
    console.log('开始扫描文件：' + this.name)
  }

  remove() {
    remove() {
      // 根节点或者树外的游离节点
      if (!this.parent) {
        return
      }

      const files = files.filter((item) => item === this)
    }
  }
}
```

### 组合模式的缺点
- 系统中的每个对象看起来都与其他对象差不多，它们的区别只有在运行的时候才会显现出来，这会使代码难以理解
- 如果通过组合模式创建了太多的对象，那么这些对象可能会让系统负担不起
