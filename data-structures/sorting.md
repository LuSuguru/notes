## 排序

这里我们讨论的排序都是 **基于比较的排序**，除赋值运算外，"<"，">"是仅有的允许对输入数据进行的操作

### 定理
1. 通过交互相邻元素进行排序的任何算法平均需要 O(N2) 时间

### 插入排序 时间复杂度为 O(N2)
**插入排序** 由 N-1 趟排序组成。对于 P = 1 趟到 P = N-1 趟，**插入排序** 保证从位置 0 到位置 P 上的元素为已排序状态
 
<img/>

```C++
InsertionSort(ElementType A[], int N) {
  int j, p;

  ElmentType Tmp;
  for (p = 1; p < N; p++) {
    Tmp = a[p];
    for (j = p; j > 0 && A[j - 1] > Tmp; J--) {
      A[j] = A[j - 1];
    }
    A[j] = Tmp
  }
}
```

### 希尔排序（缩小增量排序）
- **希尔排序** 使用一个序列 h1,h2,h3,h4,ht,叫做**增量序列**
- 在使用增量 hk 的一趟排序之后（所有相隔 hk 的元素都被排序），对于每一个 i 我们有 A[i] <= A[i + hk]，此时称文件是 **hk-排序**的
- 一趟 hk-排序 的作用就是对 hk 个独立的子数组执行一次插入排序

<img/>

```C++
  shellSort(ElementType A[], int N) {
    int i, j, Increment;
    ElementType Tmp;

    for (Increment = N / 2; Increment > 0; Increment /= 2) {
      for (i = Increment; i < N; i++) {
        Tmp = A[i]

        for (j = i; j >= Increment; i -= Increment) {
          if(Tmp < A[j - Increment]) {
            A[j] = A[j - Increment]
          } else {
            break
          }
        }

        A[j] = Tmp
      }
    }    
  }
```

**希尔排序** 的运行时间依赖于增量序列的选择，最坏情况下的运行时间为 O(N2)
采用 *Hibbard* 增量的最坏情形下运行时间为 O(N 3/2)
采用 *Sedgewick* 增量的最坏运行时间为 O(N 4/3)，平均运行时间为O(N 7/6)

**希尔排序**的简单特点使得它成为对适度地大量的输入数据经常选用的算法

### 堆排序
- 建立 N 个元素的 **二叉堆**
- 执行 N 次 DeleteMin，按照顺序，最小的元素先离开堆
- 通过将这些元素记录到第二个数组然后再将数组拷贝回来，我们得到 N 个元素的排序
- 由于每个 DeleteMin 花费时间 O(log N)，因此总的执行时间为 O(N log N)

该算法最大的问题是它使用了一个附加的数组，因此，存储需求增加一倍

#### 第二种解法
- 在每次 DeleteMin 之后，堆缩小了1，因此，位于堆中最后的元素可以用来存放刚刚删去的元素
- 使用这种策略，在最后一次 DeleteMin 后，该数组将以递减的顺序包含这些元素，也就完成了排序

```c++
  leftChild(i) {
    return 2 * i + 1
  }

  percDown(ElementType A[], int i, int N) {
    int Child
    ElementType Tmp

    for (Tmp = A[i]; leftChild(i) < N; i = Child) {
      Child = leftChild(i)
      if(Child != N - 1 && A[Child + 1] > A[Child]) {
        Child++
      }

      if(Tmp < a[Child]) {
        A[i] = A[Child]
      } else {
        break
      }
    }

    A[i] = Tmp
  }

  heapSort(ElementType A[], int N) {
    int i

    for(i = N / 2; i >= 0; i--) {
      percDown(A, i, N)
    }

    for(i = N - 1; i > 0; i--) {
      Swap(&A[0], &A[i])
      percDown(A, 0, i)
    }
  }
```

### 归并排序
**归并排序**以 O(N log N) **最坏情形运行时间**运行，所使用的比较次数几乎是最优的

**归并排序**的基本操作是合并两个已排序的表，因为这两个表是已经排序的，所以若将输出放到第三个表中时，则该算法可以通过对输入数据一趟排序来完成

具体步骤如下：
- 取两个输入数组 A 和 B，一个输出数组 C，以及三个计数器 Aptr，Bptr，Cptr，它们初始置于对应数组的开始端
- A[Aptr] 和 B[Bptr] 中的叫较小者被拷贝到 C 中的下一个位置，相关的计数器向前推进一步
- 当两个输入表中有一个用完的时候，则将另一个表中剩余部分拷贝到C中

通过递归地将前半部分数据和后半部分数据各自归并排序，得到排序后的两部分数据，然后再将两部分合并到一起，直到完成整个数组

**分治策略**：将问题分为一些小的问题然后递归求解，而治的阶段则将分的阶段解得的各个答案修补到一起

归并排序的实现见下图，整个 merge 是非常巧妙的，它只利用了个临时数组就完成了两个数组的合并，如果每次 merge 都创建一个零时数组，那么对内存的利用都是致命的

```c++
mSort(ElementType a[], ElementType tmpArray[], int left, int right) {
  int center

  if(left < right) {
    center = (left + right) / 2
    mSort(a, tmpArray, left, center)
    mSort(a, tmpArray, center + 1, right)
    merge(a, tmpArray, left, center + 1, right)
  }
}

merge(ElementType a[], ElementType tmpArray[], int lPos, int rPos, int rightEnd) {
  int i, leftEnd, numElements, tmpPos;

  leftEnd = rPos - 1
  tmpPos = lPos
  numElements = rightEnd - lPos + 1

  while(lPos <= leftEnd && rirht <= RightEnd) {
    if(a[lPos] <= a[rPos]) {
      tmpArray[tmpPos++] = a[lPos++]
    } else {
      tmpArray[tmpPos++] = a[rPos++]
    }
  }

  while(lPos <= leftEnd) {
    tmpArray[tmpPos++] = a[lPos++]
  } 

  while(rPos <= rightEnd) {
    tmpArray[tmpPos++] = a[rPos++]
  }

  for(i =0; i < numElements; i++, rightEnd--) {
    a[RightEnd] = tmpArray[rightEnd]
  }
}

mergeSort(ElementType a[], int n) {
  ElementType tmpArray
  tmpArray = malloc( n * sizeof(ElementType))

  if(tmpArray !== NULL) {
    mSort(A, tmpArray, 0, n - 1)
    free(tmpArray)
  }
}
```

虽然 **归并排序的运行时间**是O(N log N)，但是它很难用于主存排序，主要问题在于合并两个排序的表需要线性附加内存，在整个算法中还要花费将数据拷贝到临时数组再拷贝回来这样一些附加的工作，其结果严重放慢了排序的速度

### 快速排序
**快速排序**是在实践中最快的已知排序算法，基于它非常精炼和高度优化的内部循环，它的平均运行时间是 O(N log N)，最坏情形的性能为 O(log N2)
它分为以下4步，

1. 如果S中元素个数是 0 或 1，则返回
2. 取 S 中任一元素 v，称之为 **枢纽元**
3. 将 S - |v| 分成两个不想交的集合： S1 = { x ¢ S - |v|| x <= v } 和 S1 = { x ¢ S - |v|| x >= v }
4. 返回 `guickSort( S1) 后`，继而 `quickSort(S2)`

可见，**枢纽元** 的选择直接影响了 **快速排序** 的性能，直观来看，我们希望 **枢纽元**是切好中间的元素，这样 S1 中占一半的元素，S2 中占一半的元素
当在适当的位置分割两个数组，会使该算法非常的高效

#### 选取枢纽元

**一种错误的方法**：选取第一个元素作为枢纽元或选取前两个互异的关键字中的较大者作为枢纽元，如果数组是排过序的，则排序时间是二次的