// const http = require('http')

// let requestData = ''

// http.request({
//   host: '127.0.0.1',
//   port: '3000',
//   method: 'get'
// }, function (res) {

//   res.on('data', function (chunck) {
//     requestData += chunck
//   })

//   res.on('end', function () {
//     console.log(requestData)
//   })

// }).end()


let xhr = null
let url = 'http://127.0.0.1:3000'

if (window.XMLHttpRequest) {
  xhr = new XMLHttpRequest()
} else {
  xhr = new ActiveXObject('Microsoft.XMLHttp')
}

xhr.open('PUT', url, true)
xhr.onreadystatechange = function () {
  const { readyState, status, responesText } = xhr  
  if (readyState === 4 && status === 200) {
    console.log(responesText, 'result')
  }
}
xhr.setRequestHeader('name', 'longjincen')
xhr.send()