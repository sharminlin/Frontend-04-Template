const createElement = (type, attributes, ...children) => {
  const element = document.createElement(type)
  console.log(attributes)
  for (const name in attributes) {
    element.setAttribute(name, attributes[name])
  }
  document.body.append(element)
}

module.exports = {
  createElement
}
