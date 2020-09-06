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

那么等下一次某条路径也要走这个点时，我们比较`deep`值，取最小深度的前置点。

### 最短路径 -- 更正

BFS广度优先搜索，其实自带深度值。在寻路问题中，队列可以看作是一个级别的权重值相邻。可以理解为1米5高的人一定是排在一起了，一定是顺序出队，所以上面实现的的最短路径解法其实是多此一举的。因为BFS已经就是最短路径的算法了。虽然它的性能是最差的。但最终一定可以得到一个最优解。

在课上我们其实加了一个**启发式搜索方法**，这极大的增加了寻路效率，实现的原理是打破队列的出队顺序，转而每次取距离**终点直线距离**最近的点出队。因此我们舍弃了一些点，寻找过程变快，但得到的解不一定是最优解。

因此问题来了，如何在舍弃一些点的同时，还能保证得到最优解。

#### A-star算法

先抛出一个公式：

> f(i) = g(i) + h(i)

- `g(i)`: 从**起点**到**i点**，所需要的付出的代价，这个代价是可知的。因为你自己走过的路自己总记得吧0.0
- `h(i)`：从**i点**到**终点**，所需要的付出的代价，这个代价是个估值，如何进行估值，就是我们需要考虑的事情。
- `f(i)`：从**起点**，经由**i点**，再到**终点**，所需要付出的代价估值。

回顾一下课上是如何在队列中拿取一个最优点的：

``` js
// @point [x, y]
function distance (point) {
  return (point[0] - end[0]) ** 2 + (point[1] - end[1]) ** 2
}
```

这个距离其实，就是**i点**到**终点**的欧几里得距离的平方。害，就喜欢取些高深莫测的名字，不就是两点之间的直线距离蛮。在这里，其实这就是`h(i)`的值。那么，课上的启发式算法，其实就是：

``` js
f(i) = g(i) + h(i) // （令 g(i) = 0）
```

噢！原来课上搞得就是`A-star`啊。反过来说，`A-star`就是属于启发式算法的一种。

回到问题上来，现在如何优化一下这个公式，使之更加合理。

#### 定义公式

参考文章：[A*寻路算法](https://blog.csdn.net/weixin_44489823/article/details/89382502)

1. 首先，定义移动代价：横纵向移动为1，斜向为√2
2. 由此定义`G`：$G(i)=F(i - 1)+\sqrt{(x_i - x_{i-1})^2+(y_i - y_{i-1})^2}$。
3. 由此定义`H`：$H(i)=|x_i-x_1|+|y_i-y_1| （x_1, y_1 为终点）$。

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

看看实现代码：
``` js
class BinaryHeap {
  constructor(heap, compare) {
    this.heap = heap
    this.compare = compare || ((a, b) => a - b)
  }
  get size() {
    return this.heap.length
  }
  take() {
    if (!this.size) return
    // 取根值
    const root = this.heap[0]
    // 末尾值占据根值
    this.heap[0] = this.heap[this.size - 1]
    this.heap.pop()
    // DO 下沉调整
    this.sink(0)
    return root
  }
  give(v) {
    // 尾部追加
    this.heap.push(v)
    // 上浮调整
    this.floatUp(this.size - 1)
  }
  // 下沉
  sink(i) {
    let indexList = [/* 本父节点 */i, /* 左子节点 */2*i+1, /* 右子节点 */2*i+2].filter(k => k >= 0 && k < this.size)
    if (!indexList.length) return
    // 实现最小堆，找三个中最小的
    let minIndex = this.getMinInMutilple(indexList)
    // 如果不是i，则交换
    if (minIndex !== i) {
      let temp = this.heap[i]
      this.heap[i] = this.heap[minIndex]
      this.heap[minIndex] = temp
      // 递归
      this.sink(minIndex)
    }
  }
  // 上浮
  floatUp(i) {
    let father = Math.floor((i - 1) / 2)
    // 超出边界
    if (father < 0 || father >= this.size) return
    // 最小堆，最小值不是父节点，交互值并递归
    if (this.getMin(father, i) !== father) {
      let temp = this.heap[father]
      this.heap[father] = this.heap[i]
      this.heap[i] = temp
      // 递归
      this.floatUp(father)
    }
  }
  getMinInMutilple(indexList) {
    let minIndex = indexList[0]
    for (let i = 1; i < indexList.length; i++) {
      if (this.getMin(minIndex, indexList[i]) !== minIndex) {
        minIndex = indexList[i]
      }
    }
    return minIndex
  }
  getMin(i, j) {
    return this.compare(this.heap[i], this.heap[j]) > 0 ? j : i
  }
}
```

## LL算法构建四则运算AST

### 正则exec() 

`RegExpObject.exec(string)`用于检索字符串中的正则表达式的匹配。

当正则不带`g`的正则表达式，`exec`的表现与`match`相同。

当是一个带`g`的全局正则表达式，它会在 `RegExpObjec`t 的 `lastIndex` 属性指定的字符处开始检索字符串。检索成功，`lastIndex`将会指向匹配文本的最后一个字符的下一个位置。然后反复执行`exec`，直到匹配结果为`null`。

### tokenize 词法分析

通过正则`exec`，重复解析获取`token`词，同时做一个字典表，标识每一个`token`类型。比如：

``` js
'1 * 2 + 3'

->

[
  { type: 'Number', value: '1' }
  { type: 'Whitespace', value: ' ' },
  { type: '*', value: '*' },
  { type: 'Whitespace', value: ' ' },
  { type: 'Number', value: '2' },
  { type: 'Whitespace', value: ' ' },
  { type: '+', value: '+' },
  { type: 'Whitespace', value: ' ' },
  { type: 'Number', value: '3' },
  { type: "EOF" } // 终止符
]
```

### 语法分析

``` html
<!-- 一个完整表达式由一个加减法表达式和终止符构成 -->
<Expresion> ::= <AdditiveExpresion><EOF>

<!-- 一个加减法表达式 -->
<AdditiveExpresion> ::= 
  <MultiplicativeExpresion>
  | <AdditiveExpresion><+><MultiplicativeExpresion>
  | <AdditiveExpresion><-><MultiplicativeExpresion>

<!-- 一个乘除法表达式 -->
<MultiplicativeExpresion> ::= 
  <Number>
  | <MultiplicativeExpresion><*><Number>
  | <MultiplicativeExpresion></><Number>
```

从左往右构建`1+1*3`
1. `Number<1>` -> `MultiplicativeExpresion<1>`
2. 右侧是`+`，不符合乘除法语法，返回执行加减法规则
3. `MultiplicativeExpresion<1>` -> `AdditiveExpresion<MultiplicativeExpresion<1>>`
4. 留存`AdditiveExpresion<MultiplicativeExpresion<1>>+`，乘除法规则解析后面的`1*3`重走第一步1返回`MultiplicativeExpresion<MultiplicativeExpresion<1>*3>`
5. 再构成一个`AdditiveExpresion<AdditiveExpresion<1>+MultiplicativeExpresion<MultiplicativeExpresion<1>*3>>`
6. 得到表达式
