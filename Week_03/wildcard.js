/**
 * 模式匹配的实现，'?'代表单一字符，'*'代表任意多的字符
 * 判断source 与 pattern 是否可能相等
 */
function wildcard (source, pattern) {
  // 双指针
  let i = 0, j = 0;

  while (i < source.length) {
    if (pattern[j] === '?' || pattern[j] === source[i]) {
      // ? 直接并进
      i++
      j++
    } else if (pattern[j] === '*') {
      // 最后一个*
      if (j === pattern.length - 1) return true
      // *，表示0或多个，递归，j往后移一位，与i比，不等，与i+1比，不等，与i+2比...
      // TODO：此处可用KMP优化
      for (let k = i; k < source.length; k++) {
        if (wildcard(source.slice(k), pattern.slice(j+1))) {
          return true
        }
      }
      return false
    } else if (pattern[j] !== source[i]) {
      return false
    }
  }

  // i走完了，看看j尾部是否都是*，存在非*表示false
  while (j < pattern.length) {
    if (pattern[j] !== '*') return false
    j++
  }

  return true
}

console.log(wildcard('abcdefg', 'a*c***g*'))