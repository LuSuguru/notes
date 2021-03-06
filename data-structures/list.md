### 模块化
程序设计的基本法则之一是例程不应超过一页。为了遵循这个原则我们可以把程序分割为一些**模块**，每个模块是一个逻辑单位并执行某个特定的任务

- 模块化的优势：
  1. 调试小程序比调试大程序要容易得多
  2. 多个人同时对一个模块式程序编程要更容易
  3. 一个写得好的模块化程序把某些依赖只局限在一个例程中，这样使得修改起来会更容易


### 抽象数据类型（ADT）
- 是一些操作的集合
- 是数学的抽象
- 不涉及如何实现操作
- 操作的实现只在程序中编写一次，而程序中任何其他部分需要在该 ADT 上运行其中的一种操作时可以通过调用适当的函数来进行

### 数组
- 数组会创建一块连续的内存区域
- 创建时需要对存储的最大值进行估计，大小必须事先已知，可能会浪费大量的空间
>
- 数组在 **printList** 和 **find** 是 O(N)，**findKth** 时时间复杂度为 O(1)，所以数组在查找指定位置时速度会很快
- 然而，数组的 **insert** 和 **delete** 的花费是昂贵的。例如，在 0 位置的插入需要将整个数组后移一个位置以空出空间来，而删除第一个元素则需要将表中的所有元素前移一个位置，这两种操作的时间复杂度都是 O(N)

### 链表
- 由一系列不存在内存中相连的结构组成。每一个结构均含有表元素和指向包含该元素后继元的结构的指针。我们称之为 **Next** 指针。最后一个单元的 Next 指向 null
>
- 链表在 **printList** 和 **find** 时只要将一个指针传递到该表的第一个元素，然后用一些 Next 指针穿越该表即可，时间复杂度为 O(N)
- **findKth** 操作不如数组实现的效率高，需要显式的穿越链表去查找值，时间复杂度为 0(N)
- **delete** 和 **insert** 时间复杂度都为 O(1)

- 一般在创建链表时，会留出一个标志节点，称为**表头**和**哑结点**，**表头**主要解决三个问题：
  1. 并不存在从所给定义出发在表的前面插入元素的真正显性的方法
  2. 从表的前面实行删除是一个特殊情况，因为它改变了表的起始端，编程中的疏忽可能造成表的丢失
  3. 删除算法要求我们知道被删除元素前继元

##### 双向链表
- 每个结构附加了一个域，使它包含指向前一个单元的指针
- 它增加了空间的需求，并且使插入和删除的开销也增进了一倍，因为有更多的指针需要定位
- 使链表的操作更加灵活，简化了操作

##### 循环链表
- 在双向链表的基础上，使头尾两个链表也相连

##### 链表使用案例
1. 多项式ADT：多项式的每一项都通过链表表示
2. **基数排序**（每个存储单元用链表表示）
   - 有 N 个整数，范围从 1 到 M，先留置一个数组，称之为 Count，大小为 M，初始化为 0，于是 Count 有 M 个单元，开始时它们都是空的，当 Ai 被读入时 Count[Ai] 增1
   - 基数排序是这种方法的推广，我们先根据最高位数获取排序次数，然后按照最低”位“优先的方式进行桶式排序
   - 重复排序次数后的桶式排序后排序成功
3. 多重循环表（省空间花时间）

##### 链表的游标实现
链表的实现有两个重要的特点：
1. 数据存储在一组结构体中。每一个结构体包含有数据以及指向下一个结构体的指针
2. 一个新的结构体可以通过 **malloc** 而从系统内存中得到，也可以通过 **free** 函数而被释放

游标法为了满足这两条：
- 为了满足1，要有一个全局的结构体数组。对于该数组中的任何单元，其数组下标可以用来代表一个地址
- 为了满足2，我们在数组中保留一个 **freelist**，这个表由不在任何表中的单元构成，用单元 0 作为表头
- 为了执行 malloc 功能，将第一个元素从 freelist 中删除，为了执行 free 功能，我们将该单元放在 freelist 的前端
- 由于缺少内存管理例程，因此，如果运行的 **find** 函数相对较少，则游标实现的速度会显著加快

|slot|element|next|
|---|---|---|
|0|-|6|
|1|b|9|
|2|f|0|
|3|header|7|
|4|-|0|
|5|header|10|
|6|-|4|
|7|c|8|
|8|d|2|
|9|e|0|
|10|a|1|

### 栈
- 栈是限制插入和删除只能在一个位置上进行的表，该位置是表的末端，叫做**栈顶**
- 对栈的基本操作有 **Push(进栈)** 和 **Pop(出栈)**
- 栈又称为 LIFO(后进先出)表

##### 栈的实现
- 链表：
  1. 通过建立一个空结点创建空栈，Push 是作为向链表前端进行插入而实现，链表的前端作为栈顶，Pop 是通过删除表的前端的元素来实现的
  2. 所有的操作均花费常数时间，因为这些例程没有任何地方涉及到栈的大小，不过，malloc 和 free 的调用是昂贵的，特别是与指针操作的例程相比尤其如此，可以通过使用第二个栈避免
- 数组：
  1. 每一个栈有一个 TopOfStack，对于空栈它是 -1，为了将某个元素 X 压入到该栈中，我们将 TopOfStack 加 1，然后置 `Stack[TopOfStack] = X`，为了弹出栈元素，我们置返回值为 `Stack[TopOfStack]` 然后 TopOfStack 减 1
  2. 通过数组实现可以规避创建开销大的问题，但是，它需要提前声明一个数组的大小

##### 栈使用案例
1. 平衡符号（配合2，3，4相结合记录运算过程）
2. 后缀表达式（计算后缀表达式）
3. 中缀到后缀的转换（根据优先级对表达式进行转换）
4. 函数调用（通过栈维护上下文环境），由于函数调用会把当前的函数信息存入栈顶，所以递归调用的情况下可能会导致栈溢出

### 队列
- 队列是先进后出表，即插入在一端而删除在另一端进行
- 队列的基本操作是 **Enqueue(入队)** 和 **Dequeue(出队)**

##### 队列的实现
- 数组：
 1. 保留一个数组 Queue[] 以及位置 Front 和 Rear，它们代表队列的两端。我们还要记录实际存在于队列中的元素的个数 Size，所有这些信息是作为一个结构的一部分
 2. 为使一个元素 X 入队，我们让 Size 和 Rear 增 1，然后置 `Queue[Rear] = X`
 3. 若使一个元素出队，我们置返回值为 `Queue[Front]`，Size 减 1，然后使 Front 增 1

##### 循环数组
只要 Front 或 Rear 到达数组的尾端，它就又绕回开头，需要注意的是： 检测队列是否为空非常重要，因为当队列为空时一次 Dequeue 操作将不知不觉返回一个不确定的值