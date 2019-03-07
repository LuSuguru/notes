### JavaScript中的隐式转换
#### JS数据类型
- 基础类型（原始值）：Undefined、Null、String、Number、Boolean、Symbol
- 复杂类型（对象值）：Object

#### 三种转换类型
- ToPrimitive(input,PreferredType?)
  - input是要转换的值，PreferredType是可选参数，可以是Number或String类型。他只是一个转换标志，转化后的结果并不一定是这个参数所值的类型，但是转换结果一定是一个原始值（或者报错）
  - 如果PreferredType被标记为Number，则会进行下面的操作流程来转换输入的值
    如果输入的值已经是一个原始值，则直接返回它
    否则，如果输入的值是一个对象，则调用该对象的valueOf()方法，如果valueOf()方法的返回值是一个原始值，则返回这个原始值
    否则，调用这个对象的toString()方法，如果toString()方法返回的是一个原始值，则返回这个原始值
    否则，抛出TypeError异常
  - 如果PreferredType被标记为String，则会进行下面的操作流程来转换输入的值
    如果输入的值已经是一个原始值，则直接返回它
    否则，调用这个对象的toString()方法，如果toString()方法返回的是一个原始值，则返回这个原始值
    否则，如果输入的值是一个对象，则调用该对象的valueOf()方法，如果valueOf()方法的返回值是一个原始值，则返回这个原始值
    否则，抛出TypeError异常
  - 如果没有PreferredType参数
    该对象为Date类型，则PreferredType被设置为String，否则，PreferredType被设置为Number

- ToNumber

参数|结果
---|---
undefined|NaN
null|+0
布尔值|true转化为1，false转化为+0
数字|无须转换
字符串|有字符串解析为数字，例如：‘324’转换为324，‘qwer’转换为NaN
对象(obj)|先进行ToPrimitive(obj, Number)转换得到原始值，在进行ToNumber转换为数字

- ToString

参数|结果
---|---
undefined|'undefined'
null|'null'
布尔值|转换为'true' 或 'false'
数字|数字转换字符串，比如：1.765转为'1.765'
字符串|无须转换
对象(obj)|先进行 ToPrimitive(obj, String)转换得到原始值，在进行ToString转换为字符串

#### valueOf()和toString()
- valueOf()
  - Number、Boolean、String这三种构造函数生成的基础值的对象形式，通过valueOf转换后会变成相应的原始值
  - Date这种特殊的对象，其原型Date.prototype上内置的valueOf函数将日期转换为日期的毫秒的形式的数值
  - 除此之外返回的都为this，即对象本身

- toString()
  - Number、Boolean、String、Array、Date、RegExp、Function这几种构造函数生成的对象，通过toString转换后会变成相应的字符串的形式，因为这些构造函数上封装了自己的toString方法

  ```javaScript
  var num = new Number('123sd');
  num.toString(); // 'NaN'

  var str = new String('12df');
  str.toString(); // '12df'

  var bool = new Boolean('fd');
  bool.toString(); // 'true'

  var arr = new Array(1,2);
  arr.toString(); // '1,2'

  var d = new Date();
  d.toString(); // "Wed Oct 11 2017 08:00:00 GMT+0800 (中国标准时间)"

  var func = function () {}
  func.toString(); // "function () {}"
  ```

  - 除这些对象及其实例化对象之外，其他对象返回的都是该对象的类型，(有问题欢迎告知)，都是继承的Object.prototype.toString方法

  ```javascript
  var obj = new Object({});
  obj.toString(); // "[object Object]"

  Math.toString()// "[object Math]"
  ```

#### ==运算符类型转化
- 若x,y类型相同
  - 没有类型转换，主要注意NaN不与任何值相等，包括它自己，即NaN !== NaN
- 若x,y类型不相同
  - x,y 为null、undefined两者中一个   // 返回true
  - x,y为Number和String类型时，则转换为Number类型比较。
  - 有Boolean类型时，Boolean转化为Number类型比较。
  - 一个Object类型，一个String或Number类型，将Object类型进行原始转换后，按上面流程进行原始值比较

#### +运算符类型转化
 - 若x,y为undefined、null、boolean、number中一个，则转换为Number类型运算
 - 若x,y为string、obj中一个，则转换为String类型运算

#### *，/类型转化
 - 转换为Number类型比较
