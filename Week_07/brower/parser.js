/**
 * DOM树
 */
const { addCssRules, computeCss } = require('./computing')
const EOF = Symbol('EOF')

let currentToken = null
let currentArrtribute = null
let currentTextNode = null

let stack = [{ type: 'document', children: [] }]
function emit(token) {
  // console.log(token)
  let top = stack[stack.length - 1]
  if (token.type === 'startTag') {
    let element = {
      type: 'element',
      children: [],
      attributes: []
    }
    element.tagName = token.tagName

    for (let p in token) {
      if (p !== 'type' && p !== 'tagName') {
        element.attributes.push({
          name: p,
          value: token[p]
        })
      }
    }

    computeCss(stack, element)

    top.children.push(element)
    element.parent = top
    if (!token.isSelfClosing) {
      stack.push(element)
    }
    currentTextNode = null
  } else if (token.type === 'endTag') {
    if (top.tagName !== token.tagName) {
      throw new Error('Tag start end dose not match!')
    } else {
      if (top.tagName === 'style') {
        addCssRules(top.children[0].content)
      }
      stack.pop()
    }
    currentTextNode = null
  } else if (token.type === 'text') {
    if (currentTextNode === null) {
      currentTextNode = {
        type: 'text',
        content: ''
      }
      top.children.push(currentTextNode)
    }
    currentTextNode.content += token.content
  }
}

/**
 * HTML标签有三种，1开始标签 2结束标签 3自封闭标签
 */

function data (char) {
  if (char === '<') {
    return tagOpen
  } else if (char === EOF) {
    emit({ type: 'EOF' })
    return
  } else {
    emit({ type: 'text', content: char })
    return data
  }
}

// 前置字符是 <
function tagOpen (char) {
  if (char === '/') {
    // 说明是结束符号
    return endTagOpen
  } else if (char.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'startTag',
      tagName: ''
    }
    return tagName(char) // ‘<’之后如果是字母，那进入tagName，开始收集
  } else {
    emit({ type: 'text', content: char })
    return
  }
}
// 前置字符是 /
function endTagOpen (char) {
  if (char.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: ''
    }
    return tagName(char) // 进入收集tagName
  } else if (char === '>') {

  } else if (char === EOF) {

  } else {

  }
}

function tagName (char) {
  if (char.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (char === '/') {
    return selfClosingStartTag
  } else if (char.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += char
    return tagName
  } else if (char === '>') {
    emit(currentToken)
    return data
  } else {
    currentToken.tagName += char
    return tagName
  }
}

// 收集到属性名之前
function beforeAttributeName (char) {
  if (char.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (char === '>' || char === '/' || char === EOF) {
    return afterAttributeName(char)
  } else if (char === '=') {
    return beforeAttributeName
  } else {
    currentArrtribute = {
      name: '',
      value: ''
    }
    return attributeName(char)
  }
}

// 收集属性名
function attributeName (char) {
  if (char.match(/^[\t\n\f ]$/) || char === '>' || char === '/' || char === EOF) {
    return afterAttributeName(char)
  } else if (char === '=') {
    return beforeAttributeValue
  } else if (char === '\u0000') {

  } else if (char === '\'' || char === '\"' || char === '<') {

  } else {
    currentArrtribute.name += char
    return attributeName
  }
}

function afterAttributeName (char) {
  if (char.match(/^[\t\n\f ]$/)) {
    return afterAttributeName(char)
  } else if (char === '/') {
    return selfClosingStartTag
  } else if (char === '=') {
    return beforeAttributeValue
  } else if (char === '>') {
    currentToken[currentArrtribute.name] = currentArrtribute.value
    emit(currentToken)
    return data
  } else if (char === EOF){
    
  } else {
    currentToken[currentArrtribute.name] = currentArrtribute.value
    currentArrtribute = {name: '', value: ''}
    return attributeName(char)
  }
}

function beforeAttributeValue (char) {
  if (char.match(/^[\t\n\f ]$/) || char === '>' || char === '/' || char === EOF) {
    return beforeAttributeValue
  } else if (char === '\"') {
    return doubleQuotedAttributeValue
  } else if (char === '\'') {
    return singleQuotedAttributeValue
  } else if (char === '>') {

  } else {
    return UnquotedAttributeValue(char)
  }
}

function doubleQuotedAttributeValue (char) {
  if (char === '\"') {
    currentToken[currentArrtribute.name] = currentArrtribute.value
    return afterQuotedAttributeValue
  } else if (char === '\u0000') {

  } else if (char === EOF) {

  } else {
    currentArrtribute.value += char
    return doubleQuotedAttributeValue
  }
}

function singleQuotedAttributeValue (char) {
  if (char === '\'') {
    currentToken[currentArrtribute.name] = currentArrtribute.value
    return afterQuotedAttributeValue
  } else if (char === '\u0000') {

  } else if (char === EOF) {

  } else {
    currentArrtribute.value += char
    return singleQuotedAttributeValue
  }
}

function afterQuotedAttributeValue (char) {
  if (char.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (char === '/') {
    return selfClosingStartTag
  } else if (char === '>') {
    currentToken[currentArrtribute.name] = currentArrtribute.value
    emit(currentToken)
    return data
  } else if (char === EOF) {

  } else {
    currentArrtribute.value += char
    return doubleQuotedAttributeValue
  }
}

function UnquotedAttributeValue (char) {
  if (char.match(/^[\t\n\f ]$/)) {
    currentToken[currentArrtribute.name] = currentArrtribute.value
    return beforeAttributeName
  } else if (char === '/') {
    currentToken[currentArrtribute.name] = currentArrtribute.value
    return selfClosingStartTag
  } else if (char === '>') {
    currentToken[currentArrtribute.name] = currentArrtribute.value
    emit(currentToken)
    return data
  } else if (char === '\u0000') {

  } else if (char === '\"' || char === '\'' || char === '=' || char === '\`' || char === '<') {

  } else if (char === EOF) {

  } else {
    currentArrtribute.value += char
    return UnquotedAttributeValue
  }
}

function selfClosingStartTag (char) {
  if (char === '>') {
    currentToken.isSelfClosing = true
    emit(currentToken)
    return data
  } else if (char === 'EOF') {

  } else {}
}

module.exports.parserHTML = function (html) {
  console.log(html)
  let state = data
  for (let char of html) {
    state = state(char)
  }
  state = state(EOF)
  console.log(stack)
}
