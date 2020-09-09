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

// 去掉递归
function wildcardV2 (source, pattern) {
  // 四个指针
  let i = 0, j = 0;
  let iRecord = -1, jRecord = -1;

  while (i < source.length) {
    if (pattern[j] === '?' || pattern[j] === source[i]) {
      // ? = 直接并进
      i++
      j++
    } else if (pattern[j] === '*') {
      // 最后一个*，不用比了
      if (j === pattern.length - 1) return true
      j = j + 1 // j往后移一位
      iRecord = i // 更新记录此时i
      jRecord = j + 1 // 更新记录此时j
    } else if (iRecord >= 0) {
      // 有记录位，遇到不等，回退（这个回退像极了KMP，后面优化）
      i = iRecord + 1
      j = jRecord
      iRecord++ // i记录位进1
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

// TODO 加上kmp
function wildcardV3 (source, pattern) {
  const pmt = getPmt(pattern)
  // 四个指针
  let i = 0, j = 0;
  let iRecord = -1, jRecord = -1;

  while (i < source.length) {
    if (pattern[j] === '?' || pattern[j] === source[i]) {
      // ? = 直接并进
      i++
      j++
    } else if (pattern[j] === '*') {
      // 最后一个*，不用比了
      if (j === pattern.length - 1) return true
      j = j + 1
    } else if (iRecord >= 0) {
      // 回退
      // i = iRecord + 1
      // iRecord++
      j = pmt[j]
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

// 研究生成pmt表
// ? 表示任意一个字符，不管咋都+1
// * 遇到*，回退基础值应该更新为*后面一位
function getPmt (pattern) {
  const pmt = new Array(pattern.length).fill(0)
  // 双指针
  let i = 1, j = 0;
  let base = 0;

  while (i < pattern.length) {
    if (pattern[i] === pattern[j] || pattern[i] === '?' || pattern[j] === '?') {
      i++;
      j++;
      pmt[i] = j;
    } else {
      if (j === 0) {
        i++
      } else {
        j = pmt[j]
      }
    }
  }
  return pmt
}

console.log(wildcardV2('abcaggebdggeaabc', 'ab*ggea?b*'))
