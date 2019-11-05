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
  percDown(ElementType A[], int i, int N) {
    int Child;
    ElementType Tmp;

    for (Tmp = A[i]; leftChild(i) < N; i = Child) {
      Child = leftChild(i);
      if(Child != N - 1 && A[Child + 1] > A[Child]) {
        Child++
      }

      if(Tmp < a[Child]) {
        A[i] = A[Child]
      }
    }
  }
```