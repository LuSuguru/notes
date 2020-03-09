## 中介者模式
在程序里，也许一个对象会和其他10个对象打交道，所以它会保持10个对象的引用。当程序的规模增大，对象会越来越多，它们之间的关系也越来越复杂，难免会形成网状的交叉引用

### 作用
- 中介者模式的作用就是解除对象与对象之间的紧耦合关系
- 所有的相关对象都通过中介者对象来通信，而不是相互作用，所以当一个对象发生改变时，只需要通知中介者对象即可
- 中介者使各对象之间耦合松散，而且可以独立地改变它们之间的交互

### 实际案例
#### 发布-订阅
**发布-订阅**中的 Event 就是一个**中介者**，所以，**发布-订阅模式**也是**中介者模式**中的一种

#### 购买商品
现在有一个手机购买的页面，在购买流程中，可以选择手机的颜色以及输入购买数量，同时页面中有两个展示区域，分别向用户展示刚刚选择好的颜色和数量。还有一个按钮动态显示下一步的操作，我们需要查询该颜色手机对应的库存，如果库存数量少于这次的购买数量，按钮将被禁用并且显示库存不足，反正按钮可以点击并且显示放入购物车

在这个场景中，颜色表单，数量表单，展示区，不同按钮之间都存在着相互关系，我们可以创建一个**中介者**，让这些节点不直接与其他节点而是通过**中介者**联系，后面如果有修改或者新增逻辑，都只需要改动**中介者**里的代码：

```jsx
const goods = {
  // 手机库存
  red: 3,
  blue: 6
}

function Page() {
  const [color, setColor] = useState()
  const [number, setNumber] = useState()

  const [disabled, setDisabled] = useState(true)
  const [btnText, setBtnText] = useState('请选择手机颜色和购买数量')

  // 中介者
  function mediatorChange(color = color, number = number) {
    stock = goods[color]

    setColor(color)
    setNumber(number)

    if (!color) {
      setDisabled(true)
      setBtnText('请选择手机颜色')
      return
    }

    if (((number - 0) | 0) !== number - 0) {
      setDisabled(true)
      setBtnText('请输入正确的购买数量')
      return
    }

    if (number > stock) {
      setDisabled(true)
      setBtnText('库存不足')
      return
    }

    setDisabled(false)
    setBtnText('放入购物车')
  }

  function onSelectChange({ target: { value } }) {
    mediatorChange(value, number)
  }

  function onInputChange({ target: { value } }) {
    mediatorChange(color, value)
  }

  return (
    <>
      选择颜色：<select value={color} onChange={onSelectChange}>
        <option value="">请选择</option>
        <option value="red">红色</option>
        <option value="blue">蓝色</option>
      </select>
      输入购买数量：<input type="text" value={number} onChange={onInputChange} />

      您选择了颜色：<div>{color}</div>
      您选择了数量：<div>{number}</div>

      <button disabled={disabled}>{btnText}</button>
    </>
  )
}
```

### 优缺点
#### 优点
- 使各个对象之间得以解耦。各个对象只需关注自身功能的实现，对象之间的交互关系交给了中介者对象来实现和维护

#### 缺点
- 对象之间交互的复杂性，转移成了中介者对象的复杂性，使得中介者对象经常是巨大的。中介者对象本身往往就是一个难以维护的对象


