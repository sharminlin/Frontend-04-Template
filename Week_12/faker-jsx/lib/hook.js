export function useState(defaultValue) {
  let state = defaultValue
  function setState(value) {
    state = value
    return state
  }

  return [
    state,
    setState
  ]
}
