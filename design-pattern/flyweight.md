### 享元模式
**享元模式**是一种用于性能优化的模式，它的核心是运用共享技术来有效支持大量细粒度的对象

它的**适用场景**在于：
- 一个程序中使用了大量的相似对象
- 由于使用了大量对象，造成很大的内存开销
- 对象的大多数状态都可以变为外部状态
- 剥离出对象的外部状态之后，可以用相对较少的共享对象取代大量对象

### 定义
享元模式要求将对象的属性划分为**内部状态**和**外部状态**。通常来说，**内部状态**有多少种组合，系统中便最多存在多少个对象，所以，如何划分**内部状态**和**外部状态**，是减少共享对象数量的关键

以下是几个划分的参考依据：
- **内部状态**存储于对象内部
- **内部状态**可以被一些对象共享
- **内部状态**独立于具体的场景，通常不会改变
- **外部状态**取决于具体的场景，并根据场景而变化，外部状态不能被共享

划分过后，所有**内部状态**相同的对象都指定为同一个共享的对象，**外部状态**可以从对象身上剥离出来，并储存在外部

由于一个完整对象需要将**外部状态**塞进共享对象来组装成一个完整的对象，这需要一定的时间。因此，**享元模式**是一种用时间换空间的优化模式

### 实现
- 通过一个**对象工厂**来控制创建共享对象的过程，只有当某种共享对象被真正需要时，它才从工厂中被创建出来
- 用一个**管理器**来记录对象相关的外部状态，使这些外部状态通过某个钩子和共享对象联系起来

### 享元模式的案例
#### 文件上传
在一个文件上传模块中，每一个文件都对应一个上传对象的创建，如果上传文件过多，那么会导致很多的上传对象，增加内存消耗

如下代码，我们通过 startUpload 创建了多个 upload 对象

```js
class Upload {
  constructor(uploadType, fileName, fileSize) {
    this.uploadType = uploadType
    this.fileName = fileName
    this.fileSize = fileSize
    this.dom = null
  }

  delFile() {
    if (this.fileSize < 3000) {
      return this.dom.parentNode.removeChild(this.dom)
    }

    if (window.confirm(`确定要删除该文件吗？${this.fileName}`)) {
      return this.dom.parentNode.removeChild(this.dom)
    }
  }

  init(id) {
    this.id = id
    this.dom = document.createElement('div')
    this.dom.innerHTML =
      `<span>文件名称:${this.fileName}, 文件大小:${this.fileSize}</span>
       <button class="delFile">删除</button>`

    this.dom.querySelector('.deFile').onclick = () => {
      this.delFile()
    }

    document.body.appendChild(this.dom)
  }
}

let id = 0

window.startUpload = (uploadType, files) => {
  files.forEach(({ fileName, fileSize }) => {
    const uploadObj = new Upload(uploadType, file.fileName, file.fileSize)
    uploadObj.init(id++) // 给 upload 对象设置一个唯一的 id
  })
}

// 创建上传对象
startUpload('plugin', [
  { fileName: '1.txt', fileSize: 1000 },
  { fileName: '2.txt', fileSize: 2000 },
  { fileName: '3.txt', fileSize: 3000 },
])

startUpload('flash', [
  { fileName: '4.txt', fileSize: 4000 },
  { fileName: '5.txt', fileSize: 5000 },
  { fileName: '6.txt', fileSize: 6000 },
])

```

现在通过享元模式来重构这段代码，根据内部状态的定义，uploadType 是内部状态，外部状态通过一个管理器来进行整合

```js
class Upload {
  constructor(uploadType, fileName, fileSize) {
    this.uploadType = uploadType
  }

  delFile(id) {
    // 通过管理器删除外部状态
    uploadManager.setExternalState(id, this)

    if (this.fileSize < 3000) {
      return this.dom.parentNode.removeChild(this.dom)
    }

    if (window.confirm(`确定要删除该文件吗？${this.fileName}`)) {
      return this.dom.parentNode.removeChild(this.dom)
    }
  }
}
```

upload 的创建我们通过工厂来控制：

```js
const uploadFactory = (function () {
  const createdFlyWeightObjs = {}

  return {
    create(uploadType) {
      if (createdFlyWeightObjs[uploadType]) {
        return createdFlyWeightObjs[uploadType]
      }

      return createdFlyWeightObjs[uploadType] = new upload(uploadType)
    }
  }
})()
```

我们通过一个管理器来整合外部状态

```js
const uploadManager = (function () {
  const uploadDatabase = {}

  return {
    add(id, uploadType, fileName, fileSize) {
      const flyWeightObj = uploadFactory.create(uploadType)

      const dom = document.createElement('div')
      dom.innerHTML =
        `<span>文件名称:${this.fileName}, 文件大小:${this.fileSize}</span>
         <button class="delFile">删除</button>`

      dom.querySelector('.deFile').onclick = () => {
        flyWeightObj.delFile(id)
      }
      document.body.appendChild(dom)

      uploadDatabase[id] = { fileName, fileSize, dom }
    },

    // 注入外部属性
    setExternalState(id, flyWeightObj) {
      const uploadData = uploadDatabase[id]
      for (let i in uploadData) {
        flyWeightObj[i] = uploadData[i]
      }
    }
  }
})()

let id = 0

window.startUpload = (uploadType, files) => {
  files.forEach(({ fileName, fileSize }) => {
    uploadManager.add(++id, uploadType, fileName, fileSize)
  })
}

// 创建上传对象
startUpload('plugin', [
  { fileName: '1.txt', fileSize: 1000 },
  { fileName: '2.txt', fileSize: 2000 },
  { fileName: '3.txt', fileSize: 3000 },
])

startUpload('flash', [
  { fileName: '4.txt', fileSize: 4000 },
  { fileName: '5.txt', fileSize: 5000 },
  { fileName: '6.txt', fileSize: 6000 },
])
```

重构后，upload 对象从6个减少为2个

### 对象池
- 维护一个装载空闲对象的池子
- 如果需要对象的时候，不是直接 new，而是转从对象池里获取
- 如果对象池里没有空闲对象，则创建一个新的对象
- 当获取出的对象完成它的职责之后，再进入池子等待被下次获取

以下是一个通用的对象池实现：
```js
const objectPoolFactory = function (createObjFn) {
  const objectPool = []
  const poolLength = 10

  return {
    create(...args) {
      const obj = objectPool.length === 0
        ? createObjFn.apply(this, args)
        : objectPool.shift()

      return obj
    },
    recover(obj) {
      if (objectPool.length < 10) {
        objectPool.push(obj)
      }
    }
  }
}
```