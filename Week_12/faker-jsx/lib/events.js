export const eventNames = [
  'onClick',
]

export const normalizeEventName = (name) => {
  return name.replace('on', '').toLocaleLowerCase()
}
