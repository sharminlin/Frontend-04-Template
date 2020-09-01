# 学习笔记

## 寻路问题

### BFS广度优先搜索

即队列的遍历方法，先入先出

``` js
function bfs () {
  const queue = [start]

  while (queue.length) {
    const item = queue.shift() // 出队
    // do something
    // ...

    queue.push(/* 产生的新的值 */) // 入队
  }
}
```

数组`shift`与`push`构成队列操作，`push`与`pop`构成栈操作。**BFS**中将队列方式改成栈方式即变成**DFS**。

### 可视化效果

`async/await`阻塞JS执行，降低速度显示寻路过程。

### 存储路径

新建一个专门用来存储路径的数组，下标对应地图数组，值为该点的前置点（即当前到达下标对应点的前面那个点），可理解成单链表结构。

### 启发式搜索

优化寻找过程，每次在队列中都拿出最优的一个点。

``` js
let queue = [1, 3, 5, 7, 6, 4, 2] // 队列是无序的
```

相对来说，此时最优解即为最小/大值，那么就定义一个方法，每次都取最优解

``` js
// 默认比较方法, a > b
const defaultCompare = (a, b) => a - b
// 释放一个最优解
function take (queue, compare = defaultCompare) {
  // ...
}
```

改成`class`:

``` js
class Sorted {
  constructor (data, compare) {
    this.data = data
    this.compare = compare || ((a, b) => a - b)
  }
  // 取最小解
  take () {
    const len = this.data.length
    if (!len) return

    let min = this.data[0]
    let minIndex = 0

    for (let i = 1; i < len; i++) {
      if (this.compare(this.data[i], min) < 0) {
        min = this.data[i]
        minIndex = i
      }
    }

    this.data[minIndex] = this.data[len - 1]
    this.data.pop()
    return min
  }
  give (v) {
    this.data.push(v)
  }
}
```

### 最短路径

``` js
path = fmin(start, end) = fmin(start, end - 1) + 1
```

在求路径时，我们存了个路径链表，节点是前置点`[row, col]`，此时，加入一个节点深度值`[row, col, deep]`。

那么等下一次某条路径也要走这个点时，我们取最小深度的前置点。

### 二叉堆

#### 概念

完全二叉树的左右节点都比父节点(大/小)，则构成二叉最(大/小)堆。两个操作，取值，与追加值

#### 数组存储的节点公式

1. --父节点--下标是`k`，则左子节点下标为`2*k+1`，右子节点下标为`2*k+2`
2. --子节点--下标是`k`，则其父节点下标为`Math.floor((k - 1) / 2)`

#### 取值

1. 获取根节点值
2. 取下尾部值放在根节点处
3. 下沉，比对根节点与其左右子节点，**3**个节点值，取最小/大值与根节点作交换，并递归重复操作。直到满足二叉栈结构，或者成为叶子

#### 追加值

1. 追加到尾部
2. 与父节点比较，比父节点大/小，则交换，并递归。直到满足二叉栈结构，或者到顶部
