const EOF = Symbol('EOF')

/**
 * HTML标签有三种，1开始标签 2结束标签 3自封闭标签
 */

function data (char) {
  if (char === '<') {
    return tagOpen
  } else if (char === EOF) {
    return
  } else {
    return data
  }
}

function tagOpen (char) {
  if (char === '/') {
    // 说明是结束符号
  } else if (char.match(/^[a-zA-Z]$/)) {
    return tagName(char) // ‘<’之后如果是字母，那进入tagName，开始收集
  } else {

  }
}

module.exports.parserHTML = function (html) {
  console.log(html)
  let state = data
  for (let char of html) {
    state = state(char)
  }
  state = state(EOF)
}
