class Dog {
  constructor(name, desc) {
    this.name = name
    this.attach = {
      '咬': 99999,
      '抓': 1
    }
  }
}

class Role {
  constructor (name) {
    this.name = name
  }
  hurt (damage) {
    console.log(`${this.name}被${damage.by.name}${damage.type}了。`)
    console.log(`受到了${damage.by.attach[damage.type]}点伤害。`)
  }
}

const niuniu = new Role('妞妞')
const dog = new Dog('大黄')

niuniu.hurt({
  by: dog,
  type: '咬'
})
