// 数字的4种表现形态
// - 2进制 `0b`
// - 8进制 `0o`
// - 10进制 `10`、`.1`、`10.`、`1e2`  
// - 16进制 `0x`

function StringToNumber (str) {
  const prefix = str.slice(0, 2).toLowerCase()
  const radixMap = {
    '0b': 2,
    '0o': 8,
    '0x': 16
  }
  if (radixMap[prefix]) {
    return parseInt(str.slice(2), radixMap[prefix])
  } else {
    return Number(str)
  }
}

// 进制
function NumberToString(number, radix = 10) {
  const radixMap = {
    '2': '0b',
    '8': '0o',
    '10': '',
    '16': '0x'
  }
  return (radixMap[radix] === undefined ? '' : radixMap[radix]) + Number(number).toString(radix)
}
