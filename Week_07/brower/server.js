const http = require('http')

http.createServer((request, response) => {
  let body = []
  request.on('error', err => {
    console.error(err)
  }).on('data', chunk => {
    body.push(chunk.toString())
  }).on('end', () => {
    // body = Buffer.concat(body).toString()
    console.log('body: ' + body)
    response.writeHead(200, { 'Content-Type': 'text/html' })
    response.end(`
      <html p="myhtml" >
        <head>
          <style>
            html, body, #app {
              height: 100%;
              background-color: #fff;
            }
            #app span {
              font-size: 18px;
            }
          </style>
        </head>
        <body>
          <div id="app">
            <span>x</span>
          </div>
        </body>
      </html>
    `)
  })
}).listen(8081)

console.log('server started on http://localhost:8081')
