## 模板方法模式

### 定义
模板方法模式由两部分组成：
1. 抽象父类
2. 具体的实现子类
通常在抽象父类中封装了子类的算法框架，包括实现一些公共方法以及封装子类中所有方法的执行顺序

子类通过继承这个抽象类，也继承了整个算法结构，并且可以选择重写父类的方法

### 抽象类
模板方法模式是一种**严重依赖抽象类**的设计模式，它有两个作用：
1. 在静态语言中，便于**向上转型**，通过编译器对类型的检查，这可以让程序尽量遵守依赖倒置原则
2. 抽象类表示一种契约，继承了这个抽象类的所有子类都将拥有跟抽象类一致的接口方法

### 具体案例
我们现在需要泡杯咖啡和泡一杯茶，泡咖啡和茶的步骤如下：

|泡咖啡|泡茶|
|-|-|
|把水煮沸|把水煮沸|
|用沸水冲泡咖啡|用沸水浸泡茶叶|
|把咖啡倒进杯子|把茶水倒进杯子|
|加糖和牛奶|加柠檬|

经过抽象，它们有4个步骤是相同的：
1. 把水煮沸
2. 用沸水冲泡饮料
3. 把饮料倒进杯子
4. 加调料

我们通过抽象父类来实现相同的部分：
```js
class Beverage {
  brew() { }

  pourInCup() { }

  addCondiments() { }

  boilWater() {
    console.log('把水煮沸')
  }

  // 模板方法，封装了子类的算法框架
  init() {
    this.boilWater()
    this.brew()
    this.pourInCup()
    this.addCondiments()
  }
}
```

彼此的不同在于：
1. 原料不同
2. 泡的方式不同
3. 加入的调料不同

我们可以通过不同的子类实现不同的部分：
```js
// 咖啡
class Coffee extends Beverage{
  brew() {
    console.log('用沸水冲泡咖啡')
  }

  pourInCup() {
    console.log('把咖啡倒进杯子')
  }

  addCondiments() {
    console.log('加糖和牛奶')
  }
}

// 茶叶
class Tea extends Beverage{
  brew() {
    console.log('用沸水浸泡茶叶')
  }

  pourInCup() {
    console.log('把茶倒进杯子')
  }

  addCondiments() {
    console.log('加柠檬')
  }
}

const coffee = new Coffee()
coffee.init()

const tea = new Tea()
tea.init()
```

### 对于抽象方法的检查
在静态语言（例如 JAVA）中编译器会保证子类会重写父类中的抽象方法，但在 javaScript 中却没有进行这些检查的工作，我们有两种解决方法：
1. 用鸭子类型来模拟接口检查，以便确保子类中确实重写了父类的方法。但模拟接口检查会带来不必要的复杂性
2. 在抽象方法中直接抛出一个异常，如果没有被覆写，则会在运行时得到一个错误

```js
class Beverage {
  brew() {
    throw new Error('子类必须重写 brew')
  }

  pourInCup() {
    throw new Error('子类必须重写 pourInCup')
   }

  addCondiments() { 
    throw new Error('子类必须重写 addCondiments')    
  }

  boilWater() {
    console.log('把水煮沸')
  }

  // 模板方法，封装了子类的算法框架
  init() {
    this.boilWater()
    this.brew()
    this.pourIncup()
    this.addCondiments()
  }
}
```

### 钩子方法
通过模板方法模式，我们在父类中封装了子类的算法框架。这些算法框架在正常情况下是适用于大多数子类的，但如果有一些特别“个性”的子类呢？

**钩子方法**可以用来解决这个问题，放置钩子是隔离变化的一种常见手段。

我们在父类中容易变化的地方放置钩子，钩子可以有一个默认的实现，究竟要不要“挂钩”，这由子类自行决定。钩子方法的返回结果决定了模板方法后面部分的执行步骤，也就是程序接下来的走向，这样一来，程序就拥有了变化的可能

以上述为例，我们在父类中加入 customerWantsCondiments 钩子，用来判断需不需要加调料

```js
class Beverage {
  brew() {
    throw new Error('子类必须重写 brew')
  }

  pourInCup() {
    throw new Error('子类必须重写 pourInCup')
   }

  addCondiments() { 
    throw new Error('子类必须重写 addCondiments')    
  }

  boilWater() {
    console.log('把水煮沸')
  }

  customerWantsCondiments() {
    return true // 默认需要调料
  }

  // 模板方法，封装了子类的算法框架
  init() {
    this.boilWater()
    this.brew()
    this.pourIncup()
    if( this.customerWantsCondiments() ) {
      this.addCondiments()
    }
  }
}
```

在子类中，我们通过覆写这个钩子，使父类的模板方法产生变化

```js
class TeaWithHook {
  brew() {
    console.log('用沸水浸泡茶叶')
  }

  pourIncup() {
    console.log('把茶倒进杯子')
  }

  addCondiments() {
    console.log('加柠檬')
  }

  customerWantsCondiments() {
    return window.confirm('请问需要调料吗？')
  }
}

const teaWithHook = new TeaWithHook()
teaWithHook.init()
```

### 好莱坞原则
**定义**：我们允许底层组件将自己挂钩到高层组件中，而高层组件会决定什么时候，以何种方法去使用这些底层组件，总结为：**别调用我们，我们会调用你**

当我们用模板方法模式编写一个程序时，就意味着子类放弃了对自己的控制权，而是改为父类通知子类，哪些方法应该在什么时候被调用。作为子类，只负责提供一些设计上的细节

除此之外，**发布-订阅**、**回调函数**都包含好莱坞原则

### javaScript 另一种实现方式
javaScript 相对比较灵活，我们也可以不借助继承来实现一个模板方法模式，在大多数情况下，**高阶函数**是更好的选择

```js
// 模板方法
function Beverage(param) {
  const boilWater = () => {
    console.log('把水煮沸')
  }

  const brew = param.brew || ()=> {
    throw new Error('必须传递 brew')
  }

  const pourInCup = param.pourInCup || ()=> {
    throw new Error('必须传递 pourInCup')
  }

  const addCondiments = param.addCondiments || ()=> {
    throw new Error('必须传递 addCondiments')
  }


  function F() { }

  F.prototype.init = function () {
    boilWater()
    brew()
    pourInCup()
    addCondiments()
  }

  return F
}

// 子类
const Tea = Beverage({
  brew: function () {
    console.log('用沸水浸泡茶叶')
  },

  pourInCup: function () {
    console.log('把茶倒进杯子')
  },

  addCondiments: function () {
    console.log('加柠檬')
  }
}
```