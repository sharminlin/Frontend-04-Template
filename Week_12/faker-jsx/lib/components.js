import { isString } from './types'

export class BaseComponent {
  root = null

  mountTo(parent) {
    parent.appendChild(this.root)
  }

  appendChild(child) {
    if (this.root) {
      return this.root.appendChild(child)
    }
    return null
  }

  setAttribute(name, value) {
    if (this.root) {
      return this.root.setAttribute(name, value)
    }
    return null
  }

  getAttribute(name) {
    if (this.root) {
      return this.root.getAttribute(name)
    }
    return null
  }

  addEventListener(event, fn) {
    this.root.addEventListener(event, fn)
  }

  removeEventListener(event, fn) {
    this.root.removeEventListener(event, fn)
  }
}

export class ElementWrapper extends BaseComponent {
  constructor(type) {
    super()
    if (isString(type)) {
      this.root = document.createElement(type)
    }
  }
}

export class TextNodeWrapper extends BaseComponent {
  constructor(type) {
    super()
    this.root = document.createTextNode(type)
  }
}
