import { ElementWrapper, TextNodeWrapper } from './components'
import { isString, isNumber } from './types'
import { eventNames, normalizeEventName } from './events'

export const createElement = (type, attributes, ...children) => {
  let element
  if (isString(type)) {
    element = new ElementWrapper(type)
  } else {
    element = new type()
  }

  for (const name in attributes) {
    if (eventNames.some(e => e === name)) {
      element.addEventListener(normalizeEventName(name), attributes[name])
    } else {
      element.setAttribute(name, attributes[name])
    }
  }

  for (let child of children) {
    if (isString(child) || isNumber(child)) {
      child = new TextNodeWrapper(child)
    }
    child.mountTo(element)
  }
  return element
}
