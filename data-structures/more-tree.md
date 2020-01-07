## 自顶向下伸展树
对于 **伸展树**：
- 当一项 X 作为一片树叶被 insert 时，称为 **展开（splay）** 的一系列树的选择使得 X 成为树的新的根
- 展开操作也在 find 期间，并且如果一项也没有找到，那么就要就访问路径上的最后的节点施行一次展开

### 伸展树的问题
展开操作的直接实现需要从根沿树往下的一次遍历，以及而后的从底向上的一次遍历，无论采用何种方式，均需大量的开销，而且两者都必须处理许多特殊的情况

为了解决操作复杂的问题，我们采用一种新的结构，自顶向下伸展树

### 自顶向下伸展树的实现
- 在访问的任一时刻，我们都有一个当前节点 X，它是其子树的根，在我们的图中它被表示成“中间”树
- 我们在开辟两个节点L、R，用 L 存放在 树T 中小于 X 的子树，用 R 存放 节点大于 X 的子树
- 初始时 X 为 T 的根，而 L 和 R 是空树
- 依据情形对树进行分割：

1. 单旋转
- 如果旋转是一次单旋转，那么根在 Y 的树变成中间树的新根
- X 和子树 B 连接而成为 R 中最小项的左儿子；X 的左二子逻辑上成为 NULL，结果，X 成为 R 的新的最小项

<img/>

2. 一字型
进行一次单旋转，然后将右子树 放到 R 上
<img/>

3. 之字形
之字形我们可以简化，Z 不再是中间树的根，Y 取而代之

- 最后，我们要合并 L，R，X以形成一棵树

例子，如下图，我们要访问树中的 18
<img>

### 展开
```c++
Splay(ElementType item, Position x) {
  Position leftTreeMax, rightTreeMin

  headers.left = header.right = NullNode

  leftTreeMax = rightTreeMin = &header
  NullNode -> element = item

  while (item != x -> element) {
    if (item < x -> element) {
      if (item < x -> left -> element) {
        x = singleRotateWithLeft(x)
      }

      if (x -> left == NullNode) {
        break
      }

      rightTreeMin -> left = x
      rightTreeMin = x
      x = x -> left
    } else {
      if (item > x -> right -> element) {
        x = singleRotateWithRight(x)
      }

      if (x -> right == NullNode) {
        break
      }

      leftTreeMax -> right = x
      leftTreeMax = x
      x = x -> right
    }
  }

  leftTreeMax -> right = x -> left
  rightTreeMin -> left = x -> right

  x -> left = header.right
  x -> right = header.left

  return x
}
```

### 插入
```c++
insert(ElementType item, SplayTree t) {
  static Position newNode = null

  if (newNode == NULL) {
    newNode = malloc(sizeof(struct SplayNode))
    if (newNode == NULL) {
      FatalError('Out of space!!!')
    }
  }

  newNode -> element = item

  if (t == NullNode) {
    newNode -> left = newNode -> right = NullNode
    t = newNode
  } else {
    t = Splay(item, t)

    if (item < t -> element) {
      newNode -> left = t -> left
      newNode -> right =t
      t -> left = NullNode
      t = newNode
    } else if (item > t -> element) {
      newNode -> right = t -> right
      newNode -> left = t
      t -> right = NullNode
      t = newNode
    } else {
      return t
    }
  }

  newNode = NULL
  return t
}
```

### 删除
```c++
remove(ElementType item, SplayTree t) {
  Position newTree

  if (t != NullNode) {
    t = splay(item, t)

    if (item == t -> element) {
      if (t -> left == NullNode) {
        newTree = t -> right
      } else {
        newTree = t -> left
        newTree = splay(item, newTree)
        newTree -> right = t -> right
      }

      free(t)
      t = newTree
    }
  }

  return t
}
```

## 红黑树
红黑树是具有下列着色性质的二叉查找树：
1. 每一个节点或者着成红色，或者着成黑色
2. 根是黑色的
3. 如果一个节点是红色的，那么它的子节点必须是黑色的
4. 从一个节点到一个 NULL 指针的每一条路径必须包含相同数目的黑色节点

- 通过这些约束，对红黑树的操作在最坏情形下花费 O(log N) 时间，它的高度最多是 2log(N+1)
- 红黑树的优点是执行插入所需要的开销相对较低，再有就是实践中发生的旋转相对较少
- 同样因为这些约束，红黑树的插入、删除都及其复杂

### 红黑树的初始化
我们用 NullNode 来指示一个 Null 指针
```c++
Position NullNode = NULL

initialize(void) {
  RedBlackTree t

  if (NullNode = NULL) {
    NullNode = malloc(sizeof(struct RedBlackNode))

    if (NullNode) {
      FatalError('Out of space!!')
    }

    NullNode -> left = NullNode -> right = NullNode
    NullNode -> color = black
  }

  t = malloc(sizeof(struct RedBlackNode))

  if (t == NULL) {
    FatalError('Out of space!!')
  }
  t -> element = NegInfinity
  t -> left = t -> right  = NullNode
  t -> color = black
  return t
}
```

### 红黑树的插入
- 新插入的节点必须涂成红色。如果它的父节点是黑的，我们插入完成
- 如果它的父节点是黑的，我们插入完成
- 如果它的父节点已经是红色的，那么我们得到连续红色节点，这就违反了条件3，在这种情况下，我们必须调整该树以确保条件3满足（且又不引起条件 4 被破坏）

#### 自底向上插入
如果父节点是红色的，且父节点的兄弟节点是黑色的，我们可以通过旋转来调整它们的位置
<img>

#### 自顶向下红黑树
我们可以从根节点向下遍历，在向下的过程中当我们看到一个节点 X 有两个红儿子的时候，我们让 X 成为红的而让它的两个儿子是黑

<img>

如上图，只有当 X 的父节点 P 也是红的时候这种翻转将破坏红黑树的法则，但是此时我们可以采用前面的旋转来调整它们的结构，另外，由于是从顶向下，所以 X 的父节点的兄弟节点不可能是红色

以下是旋转的编码：
```c++
rotate(ElementType item, Position parent) {
  if (item < parent->element) {
    return parent->left =item < parent->left->element
      ? singleRotateWithLeft(parent -> left)
      : singleRotateWithRight(parent -> left)
  } else {
    rturn parent->right = item < parent->right->element
      ? singleRotateWithLeft(parent->right)
      : singleRotateWithRight(parent->right)
  }
}
```

最后是插入的过程，我们使用 HandleReorient 用来执行旋转的过程，在我们遇到带有两个红儿子的节点时被调用，在我们插入一片树叶时它也被调用
```c++
static Position x, p, gp, gpp

void handleReorient(ElemenetType item, RedBlackTree t) {
  x->color  = red
  x->left->color = black
  x->right->color = black

  if (p->color == red) {
    if ((item < gp->element) != (item < p->element)) {
      p = rotate(item, gp)
    }
    x = rotate(item, ggp)
  }
  t->right->color = black
}
```



