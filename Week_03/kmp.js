function match(source, pattern) {
  const pmt = getPmt(pattern)
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

function getPmt (pattern) {
  const pmt = new Array(pattern.length).fill(0)

  // 双指针
  let i = 1, j = 0;
  while (i < pattern.length) {
    if (pattern[i] === pattern[j]) {
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

console.log(match('abcdabc abcdabce', 'abcdabce'))
