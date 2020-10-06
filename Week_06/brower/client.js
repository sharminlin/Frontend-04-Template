
class Request {
  constructor (options) {
    this.method = options.method || 'GET'
    this.host = options.host
    this.port = options.port || '80'
    this.path = options.path || '/'
    this.body = options.body || {}
    this.headers = Object.assign({
      'Content-Type': 'application/x-www-form-urlencoded',
    }, options.headers || {})

    if (this.headers['Content-Type'] === 'application/json') {
      this.bodyText = JSON.stringify(this.body)
    } else if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&')
    }
    
    this.headers['Content-Lenth'] = this.bodyText.length
  }

  // 发送请求
  send (connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser()
      
      if (connection) {
        connection.write(this.toString()) // todo
      } else {
        connection = net.createConnection({
          host: this.host,
          port: this.port
        }, () => {
          connection.write(this.toString())
        })
      }

      connection.on('data', (data) => {
        console.log(data.toString())
        parser.receive(data.toString())
        if (parser.isFinished) {
          resolve(parser.response)
          connection.end()
        }
      })

      connection.on('error', (err) => {
        reject(err)
        connection.end()
      })
    })
  }
}

class ResponseParser () {
  constructor () {

  }
  receive (string) {
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.chatAt(i))
    }
  }
  receiveChar (char) {

  }
}

(void async function () {
  let request = new Request({
    host: '',
    port: '',
    method: 'POST',
    path: '/',
    headers: {
      ['X-Foo2']: 'customed'
    },
    body: {
      name: 'sharmin'
    },
  })

  let response = await request.send()
  console.log(response)
})();