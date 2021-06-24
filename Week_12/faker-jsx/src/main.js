import { createElement } from '../lib/index'
import { BaseComponent } from '../lib/components'
import { useState } from '../lib/hook'

class Component extends BaseComponent {
  constructor() {
    super()
    this.root = document.createElement('div')
  }
}

function createApp() {
  let [count, setCount] = useState(1)

  function handleAdd (e) {
    setCount(count++)
    console.log(count)
  }

  return <Component id="app" >
    <span>{count}</span>
    <button onClick={handleAdd}>add</button>
  </Component>
}

createApp().mountTo(document.body)
