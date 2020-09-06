const $ = Symbol('$')

class Trie {
  constructor () {
    this.root = Object.create(null)
  }
  insert (words) {
    let node = this.root

    for (let n of words) {
      if (!node[n]) {
        node[n] = Object.create(null)
      }
      node = node[n]
    }
    if (!($ in node)) node[$] = 0
    node[$]++
  }
  most () {
    let mostWords = ''
    let mostLength = 0

    function visited (node, words) {
      if (node[$] && node[$] > mostLength) {
        mostWords = words
        mostLength = node[$]
      }
      for (let n in node) {
        visited(node[n], words + n)
      }
    }
    visited(this.root, '')
    return { mostWords, mostLength }
  }
}

const trie = new Trie()
trie.insert('abc')
trie.insert('ab')
trie.insert('ab')
trie.insert('a')

console.log(trie.most())
