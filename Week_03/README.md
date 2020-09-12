# 学习笔记

## 字符串算法

1. 字典树：全等。重复字符串的存储分析
2. KMP：字符串查找
3. Wildcrd：通配符，`?`，`*`
4. 正则
5. 状态机：通用字符串分析
6. LL LR：多层级结构分析（编译原理）

### 字典树

就是一颗树，蛮好理解的。

``` js
const $ = Symbol('$')

class Trie {
  constructor () {
    this.root = Object.create(null)
  }
  // 插入
  insert (words) {
    let node = this.root

    for (let n of words) {
      if (!node[n]) {
        node[n] = Object.create(null)
      }
      node = node[n]
    }
    if (!($ in node)) node[$] = 0
    node[$]++
  }
  // 获取最长字符串
  most () {
    let mostWords = ''
    let mostLength = 0

    // 深度递归全遍历
    function visited (node, words) {
      if (node[$] && node[$] > mostLength) {
        mostWords = words
        mostLength = node[$]
      }
      for (let n in node) {
        visited(node[n], words + n)
      }
    }
    visited(this.root, '')
    return { mostWords, mostLength }
  }
}
```

### KMP

子串查找的一种算法。先琢磨琢磨暴力解：

``` js
function match(source, pattern) {
  // 双指针
  let i = 0, j = 0;
  while(i < source.length) {
    // 相等
    if (source[i] === pattern[j]) {
      // 匹配到最后，返回值
      if (j === pattern.length - 1) return i - j
      // 并行
      ++i;
      ++j;
    } else {
      // 复位，主串原位+1，子串归0
      i = i - j + 1
      j = 0
    }
  }

  return -1
}
```

时间复杂度`O(m*n)`。


### KMP的优化思路

针对暴力解，`i`指向主串，`j`指向子串。只要中途不等，`j`将直接归零，`i`将直接在复位+1，然后重新开始匹配。那么是否可以通过某种方法，减少复位的这个极长跨度？

KMP想，每次匹配中途不等短路的时候，其实前面的字符串已经匹配过了。比如：

``` js
'ABA ABAD' // 主串
'ABAD' // 子串
```

那第一次，到`D`的时候，其实已经知道指向`D`的`j`前面全匹配了`ABA`。那我还需要复位进行以下这样的匹配？

| i |   | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| - | - | - | - | - | - | - | - | - | - |
| S |   | A | B | A |   | A | B | A | D |
| P |   |   | A | B | A | D |   |   |   |
| j |   |   | 0 | 1 | 2 | 3 |   |   |   |

那是不是有一种办法，让`i`不动，我直接跳`j`:

| i |   | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| - | - | - | - | - | - | - | - | - | - |
| S |   | A | B | A |   | A | B | A | D |
| P |   |   |   | A | B | A | D |   |   |
| j |   |   |   | 0 | 1 | 2 | 3 |   |   |

`j`怎么跳？KMP说，跳重复值。什么重复值？以上述为例。第一次中断时，`D`前面是`A`，全字符串是`ABA`。那`j`就往前跳两个`A`之间的距离的跨度，即`j = 3 - 2 = 1`。当然实际情况会更复杂，比如前面是`ABCAB`，那此时应该是重复字符`AB`的跨度。前面是`ABCABDAB`, 此时应该跳到左边第一个`AB`。为什么，因为要保证跳过去之后，前面的字符串`AB`与当前的`ABCABDAB`从右一致。那怎么计算这个跨度呢。KMP搞了个PMT数组，数组长就是子串长，标记了每一个`j`发生中断时，应该往前跳到哪儿。

这个PMT数组我们先不管怎么实现，命名为`pmt = new Array(P.length).fill(-1)`，然后改写一下`match`方法：

``` js
function match(source, pattern) {
  // 双指针
  let i = 0, j = 0;
  while(i < source.length) {
    // 相等
    if (source[i] === pattern[j]) {
      // 匹配到最后，返回值
      if (j === pattern.length - 1) return i - j
      // 并行
      ++i;
      ++j;
    } else {
      if (j === 0) {
        // 第一个都不等，i往前走
        i++;  
      } else {
        // j往前跳
        j = pmt[j]
      }
    }
  }

  return -1
}
```

仔细一看，其实就复位那儿进行了一点骚操作，就省了大半的喝茶时间，完美。

### PMT表格

课上老师讲了种方法：

| a | b | c | d | a | b | c | e |
| - | - | - | - | - | - | - | - |
| 0 | 0 | 0 | 0 | 1 | 2 | 3 | 0 |

理论上是这样的，向右移一位，这样我们可以直接取，不用取的时候还计算加减法`pmt[j - 1]`:

| a | b | c | d | a | b | c | e |
| - | - | - | - | - | - | - | - |
| 0 | 0 | 0 | 0 | 0 | 1 | 2 | 3 |

上代码，首尾匹配，匹配成功双进，j的位置表示后缀能匹配多少个前缀：

**其实就是找前缀与后缀相同的最长值**

``` js
function getPmt (pattern) {
  const pmt = new Array(pattern.length).fill(0)

  // 双指针
  let i = 1, j = 0;
  while (i < pattern.length) {
    if (pattern[i] === pattern[j]) {
      i++;
      j++;
      pmt[i] = j; // 此处往右移一位，pmt[i]记录的是i之前的，不包括i的字符串噢
    } else {
      if (j === 0) {
        i++
      } else {
        j = pmt[j] // 此处不是回退至0，因为j之前的字符串可能存在相同后缀数，比如aab，如果j在b处，回退处应该是1。测试：aabaaac
      }
    }
  }
  return pmt
}
```

### Wildcard

模式匹配算法。`?`代表单一字符，`*`代表任意多的字符。

做了一遍之后发现其实有点像KMP。

用递归实现了一次，性能不太好。后面用四个指针重写了。然后结合KMP再重写了一下。主要是pmt表的实现，和普通字符串不一样。不过其实可以看作是几个字符串的pmt表连接在一起而已。

## Proxy

[vue3数据响应式实现](https://github.com/sharminlin/note/blob/master/vue/reactivity.md)

## 拖拽

基本拖拽很简单。

主要是`range`这个API的使用。
