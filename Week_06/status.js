// 字符串“abcabx”的解析

(function () {
  function match (str) {
    let state = stateA
    for (let i = 0; i < str.length; i++) {
      state = state(str[i])
      if (state === true) {
        return true
      }
    }

    return false
  }

  function stateA (char) {
    if (char === 'a') return stateB
    return stateA
  }

  function stateB (char) {
    if (char === 'b') return stateC
    return stateA(char)
  }

  function stateC (char) {
    if (char === 'c') return stateA2
    return stateA(char)
  }

  function stateA2 (char) {
    if (char === 'a') return stateB2
    return stateA(char)
  }


  function stateB2 (char) {
    if (char === 'b') return stateX
    return stateB(char)
  }

  function stateX (char) {
    if (char === 'x') return true
    return stateC(char)
  }

  console.log(match('aabcabx'))
})()


// 字符串“abababx”的解析

;(function () {
  function match (str) {
    let state = stateA
    for (let i = 0; i < str.length; i++) {
      state = state(str[i])
      if (state === true) {
        return true
      }
    }

    return false
  }

  function stateA (char) {
    if (char === 'a') return stateB
    return stateA
  }

  function stateB (char) {
    if (char === 'b') return stateA2
    return stateA(char)
  }

  function stateA2 (char) {
    if (char === 'a') return stateB2
    return stateA(char)
  }

  function stateB2 (char) {
    if (char === 'b') return stateA3
    return stateB(char)
  }


  function stateA3 (char) {
    if (char === 'a') return stateB3
    return stateA2(char)
  }

  function stateB3 (char) {
    if (char === 'b') return stateX
    return stateB2(char)
  }

  function stateX (char) {
    if (char === 'x') return true
    return stateA3(char)
  }

  console.log(match('abaaabababx'))
})()

(function () {
  function match (str, pattern) {
    let state = stateA
    for (let i = 0; i < str.length; i++) {
      state = state(str[i])
      if (state === true) {
        return true
      }
    }

    return false
  }


  console.log(match('aabcabx'))
})()