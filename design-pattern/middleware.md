## 职责链模式
### 定义
使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系，将这些对象连成一条链，并沿着这条链传递该请求

#### 实际应用
假设我们负责一个售卖手机的电商站点，经过粉笔交纳500元定金和200元定金的两轮预定后，在正式购买后，已经支付过500元定金的用户会收到100元的商城优惠券，200元定金的用户可以收到50元的优惠券，而之前没有支付定金的用户只能进入普通购买模式

我们定义3个字段：
- orderType:1.500元定金 2.200元定金 3.普通购买用户
- pay:是否已经支付定金，ture or false
- stock: 库存数量，只对普通购买的增加限制

以下是第一版的实现：
```js
function order(orderType, pay, stock) {
  if (orderType === 1) {
    if (pay) {
      console.log('500元定金预约，得到100元优惠券')
    } else {
      if (stock > 0) {
        console.log('普通购买，无优惠券')
      } else {
        console.log('手机库存不足')
      }
    }
  } else if (orderType === 2) {
    if (pay) {
      console.log('200元定金预约，得到50元优惠券')
    } else {
      if (stock > 0) {
        console.log('普通购买，无优惠券')
      } else {
        console.log('手机库存不足')
      }
    }
  } else if (orderType === 3) {
    if (stock > 0) {
      console.log('普通购买，无优惠券')
    } else {
      console.log('手机库存不足')
    }
  }
}

order(1, true, 500)
```
