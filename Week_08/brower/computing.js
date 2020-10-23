/**
 * css computing
 * npm install css
 */
const css = require('css')

let rules = []
module.exports.addCssRules = function (text) {
  var ast = css.parse(text)
  rules.push(...ast.stylesheet.rules)
}

// 将style加入到对应的element上
module.exports.computeCss = function (stack, element) {
  let elements = stack.slice().reverse()
  if (!element.computedStyle) {
    element.computedStyle = {}
  }

  for (let rule of rules) {
    for (let selectorIndex = 0; selectorIndex < rule.selectors.length; selectorIndex++) {
      // 解析空格
      var selectorParts = rule.selectors[selectorIndex].split(' ').reverse()
  
      // 先尾部选择器匹配
      if (!match(element, selectorParts[0])) {
        continue
      }
  
      let matched = false
      let j = 1
      for (let i = 0; i < elements.length; i++) {
        if (match(elements[i], selectorParts[j])) {
          j++
        }
      }

      if (j >= selectorParts.length) {
        matched = true
      }

      if (matched) {
        // ok
        let sp = specificity(rule.selectors[selectorIndex]) // 获取该选择器的优先级
        let computedStyle = element.computedStyle
        // 迭代css规则属性值
        for (let declaration of rule.declarations) {
          if (!computedStyle[declaration.property]) {
            computedStyle[declaration.property] = {}
          }
          let style = computedStyle[declaration.property]
          // 置入优先级
          if (!style.specificity) {
            style.value = declaration.value
            style.specificity = sp
          } else if (compare(style.specificity, sp) < 0) {
            style.value = declaration.value
            style.specificity = sp
          }
          style.value = declaration.value
        }
        console.log(element.computedStyle)
      }
    }
  }
}

// div .class #id
// div.classa.classb#id
function match (element, selector) {
  if (!selector || !element.attributes) {
    return false
  }

  let tagName = selector.match(/^\w+/g) // []
  let id = selector.match(/\#\w+/g) // []
  let classNames = selector.match(/\.\w+/g) // []

  // id
  if (id) {
    let attr = element.attributes.find(attr => attr.name === 'id')
    if (!(attr && attr.value === id[0].replace('#', ''))) {
      return false
    }
  }
  
  if (classNames) {
    let attr = element.attributes.find(attr => attr.name === 'class')
    if (!attr || !attr.value) return false
    let elementClassNames = attr.value.split(' ') // 节点classNames
    // 选择器class中有一个不存在于节点class里面
    if (classNames.some(selectorClass => elementClassNames.every(e => e !== selectorClass.replace('.', '')))) {
      return false
    }
  }

  if (tagName && element.tagName !== tagName[0]) {
    return false
  }
  
  return true
}

// 生成选择器优先级
function specificity (selector) {
  let p = [0, 0, 0, 0] // [inline, id, class, tag]
  let selectorParts = selector.split(' ')
  for (let part of selectorParts) {
    let tagName = selector.match(/^\w+/g) // []
    let id = selector.match(/\#\w+/g) // []
    let classNames = selector.match(/\.\w+/g) // []

    if (id) {
      p[1] += 1
    } else if (classNames) {
      p[2] += classNames.length
    } else if (tagName) {
      p[3] += 1
    }
  }
  return p
}
// 比较优先级
function compare (sp1, sp2) {
  if (sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0]
  } else if (sp1[1] - sp2[1]) {
    return sp1[1] - sp2[1]
  } else if (sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2]
  }
  return sp1[3] - sp2[3]
}
