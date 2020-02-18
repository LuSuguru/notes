## 迭代器模式
- 提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示
- 迭代器模式可以把迭代的过程从业务逻辑中分离出来

### 实现
迭代器的实现非常简单，代码如下：

```javascript
const each = function (arr, callback) {
  for (let i = 0, l = arr.length; i < l; i++) {
    callback.call(arr[i], i, arr[i])
  }
}

each([1, 2, 3], (i, n) => {
  alert([i, n])
})
```

### 内部迭代器
迭代器函数的内部已经定义好了迭代规则，它完全接手整个迭代过程，外部只需要一次初始调用

内部迭代器在调用的时候非常方便，外界不用关心迭代器内部的实现，跟迭代器的交互也仅仅是一次初始调用，但这也刚好是内部迭代器的缺点，它不够灵活

假设，我们要判断2个数组里的元素的值是否完全相等，如果不改写 each 函数本身的代码，我们能够入手的地方似乎只剩下 each 的回调函数

```javascript
const compare = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    throw new Error('arr1 和 arr2 不相等')
  }

  each(arr1, (i, n) => {
    if (n !== arr2[i]) {
      throw new Error('arr1 和 arr2 不相等')
    }
  })

  alert('arr1 和 arr2 相等')
}

compare([1, 2, 3], [1, 2, 4]) 
```

### 外部迭代器
外部迭代器必须显式地请求迭代下一个元素

它增加了一些调用的复杂度，但却增加了灵活性

我们先实现一个迭代器

```javascript
const Iterator = (obj) => {
  let current = 0

  const next = () => current += 1
  const isDone = () => current >= obj.length
  const getCurrentItem = () => obj[current]

  return { next, isDone, getCurrentItem }
}
```

改写 compare ：

```javascript
const compare = function (iterator1, iterator2) {
  while (!iterator1.isDone() && !iterator2.isDone()) {
    if (iterator1.getCurrentItem() !== iterator2.getCurrentItem()) {
      throw new Error('iterator1 和 iterator2 不相等')
    }

    iterator1.next()
    iterator2.next()
  }

  alert('iterator1 和 iterator2 相等')
}

const iterator1 = Iterator([1, 2, 3])
const iterator2 = iterator([1, 2, 3])

compare(iterator1, iterator2)
```

### 实际应用
下面是一段根据不同浏览器获取相应的上传组件对象的代码：

```javascript
const getUploadObj = function () {
  try {
    return new ActiveXObject('TXFTNActiveX.FTNUpload')
  } catch (e) {
    if (supportFlash()) {
      const str = `<object type="application/x-shockwave-flash"></object>`
      return $(str).appendTo($('body'))
    } else {
      const str = `<input name="file" type="file"/>`
      return $(str).appendTo($('body'))
    }
  }
}
```

这段代码很难阅读，而且严重违反了 **开闭原则**，开发和调试时每次改动都相当痛苦，若新增一些另外的上传方式，还得加条件分支，整个函数时极其不稳定的

首先我们按照一定的约定封装各自获取 upload 对象的函数：
```javascript
const getActiveUploadObj = () => {
  try {
    return new ActiveXObject('TXFTNActiveX.FTNUpload')
  } catch (e) {
    return false
  }
}

const getFlashUploadObj = () => {
  if (supportFlash()) {
    const str = `<object type="application/x-shockwave-flash"></object>`
    return $(str).appendTo($('body'))
  }
  return false
}

const getFormUploadObj = () => {
  const str = `<input name="file" type="file"/>`
  return $(str).appendTo($('body'))
}
```

然后使用一个迭代器，迭代获取这些 upload 对象，直到获取一个可用的为止：
```javascript
const iteratorUploadObj = (...arg) => {
  for (let i = 0, fn; fn = arg[i++];) {
    const uploadObj = fn()

    if (uploadObj !== false) {
      return uploadObj
    }
  }
}

const uploadObj = iteratorUploadObj( getActiveUploadObj, getFlashUploadObj, getFormUpladObj )
```

后续，如果增加一个 HTML5 上传对象的函数：
```javascript
const getWebKitUploadObj = function() {
  // 具体代码略
}

const uploadObj = iteratorUploadObj(getActiveUploadObj, getFlashUploadObj, getFormUpladObj, getHTML5UploadObj)
```


