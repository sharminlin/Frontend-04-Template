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

/**
 * 首尾匹配，匹配成功双进，j的位置表示后缀能匹配多少个前缀
 */
function getPmt (pattern) {
  const pmt = new Array(pattern.length).fill(0)

  // 双指针
  let i = 1, j = 0;
  while (i < pattern.length) {
    if (pattern[i] === pattern[j]) {
      // 匹配成功，进位，当前值为j的位置，表示可匹配j+1个前缀
      i++;
      j++;
      // 此处pmt[i]记录的是i之前的，不包括i的字符串噢
      pmt[i] = j;
    } else {
      if (j === 0) {
        // 0处不匹配，i往后走
        i++
      } else {
        j = pmt[j] // 此处不是回退至0，因为j之前的字符串可能存在相同后缀数，比如aab，如果j在b处，回退处应该是1。测试：aabaaac
      }
    }
  }
  return pmt
}

console.log(match("aabaar aabaaac","aabaaac"))
