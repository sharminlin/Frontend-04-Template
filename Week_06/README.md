# 学习笔记

## 使用有限状态机处理字符串

普通查找`a`字符：

``` js
function match (str) {
  for (let i = 0; i < str.length; i++) {
    if (str[i] === 'a')
      return i
  }
  return -1
}
```

普通查找`ab`字符：

``` js
function match (str) {
  for (let i = 0; i < str.length - 1; i++) {
    if (str[i] + str[i + 1] === 'ab')
      return i
  }
  return -1
}
```

普通查找`abcdef`字符：

``` js
function match (str) {
  for (let i = 0; i < str.length - 1; i++) {
    if (str.slice(i, i + 6) === 'abcdef')
      return i
  }
  return -1
}
```

## http请求
