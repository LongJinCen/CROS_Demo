const http = require('http')

const server = http.createServer()
server.on('request', function (req, res) {
  let data = ''

  req.on('data', function (chunk) {
    data += chunk
  })

  req.on('end', function () {
    const { method, headers, url, httpVersion } = req
    if (method.toLocaleLowerCase() === 'options') {
      // 处理预请求
      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT',
        'Access-Control-Allow-Headers': 'name' 
      })
      res.end()
    } else {
      // 正常请求
      res.writeHead(200, {
        'content-type': 'text/html',
        'Access-Control-Allow-Origin': '*'
      })
      let response = `<p>data:${data}</p><p>method:${method}</p><p>headers:${JSON.stringify(headers)}</p><p>url:${url}</p><p>httpVersion:${httpVersion}</p>`
  
      res.end(response)
    }
  })

  req.on('close', function (){
    console.log('请求结束')
  })

})

server.listen('3000', function (){
  console.log('listening port 3000')
})