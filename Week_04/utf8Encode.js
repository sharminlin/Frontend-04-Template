function UTF8_Encoding (str) {
  const buffer = []
  for (let i = 0; i < str.length; i++) {
    let code = str[i].charCodeAt()
    let binary = code.toString(2)

    // 补码
    if (code >= 0x00 && code <= 0x7f) {
      // 1个字节 0xxx xxxx 7->127
      buffer.push(code & 0xff) // 此处第一位补1
    } else if (code >= 0x080 && code <= 0x7ff) {
      // 2个字节 110x xxxx  10xx xxxx 11位->2047
      // 最大11位先补前面的，往右移6位，剩5位，不齐补0
      buffer.push(128 | (31 & code >> 6)) // 128: 0b10000000
      buffer.push(128 | (63 & code)) // 63：0b111111
    } else if (code >= 0x0800 && code <= 0xffff) {
      // 3个字节 1110 xxxx  10xx xxxx  10xx xxxx 16位->65535
      buffer.push(224 | (15 & code >> 12)) // 224：0b11100000；15：0b1111
      buffer.push(128 | (63 & code >> 6))
      buffer.push(128 | (63 & code))
    }
  }

  let utf8 = ''
  for (let i = 0; i < buffer.length; i++) {
    console.log(buffer[i])
    utf8 += buffer[i].toString(2)
  }
  return utf8
}

console.log(UTF8_Encoding('中'))
