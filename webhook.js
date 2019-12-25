// var http = require('http')
// var createHandler = require('github-webhook-handler')
// var handler = createHandler({ path: '/', secret: 'myapi' })
// // 上面的 secret 保持和 GitHub 后台设置的一致
// function run_cmd(cmd, args, callback) {
//   var spawn = require('child_process').spawn;
//   var child = spawn(cmd, args);
//   var resp = "";
//   child.stdout.on('data', function(buffer) { resp += buffer.toString(); });
//   child.stdout.on('end', function() { callback (resp) });
// }
// http.createServer(function (req, res) {
//   handler(req, res, function (err) {
//     res.statusCode = 404
//     res.end('no such location')
//   })
// }).listen(11009)
// handler.on('error', function (err) {
//   console.log('error', err)
//   console.error('Error:', err.message)
// })
// handler.on('push', function (event) {
//   console.log('push', event)
//   console.log('Received a push event for %s to %s',
//     event.payload.repository.name,
//     event.payload.ref);
//     // run_cmd('sh', ['./deploy.sh',event.payload.repository.name], function(text){ console.log(text) });
// })


var http = require('http')
var createHandler = require('node-github-webhook')
var handler = createHandler([ // 多个仓库
  {
    path: '/app-api',
    secret: 'app-api'
  },
  // {
  //   path: '/app2',
  //   secret: 'CUSTOM'
  // }
])
// var handler = createHandler({ path: '/webhook1', secret: 'secret1' }) // 单个仓库

http.createServer(function (req, res) {
  handler(req, res, function (err) { 
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(11009,()=>{
  console.log('webhook start on port 11009')
})

handler.on('error', function (err) {
  console.error('Error:', err.message)
})

handler.on('push', function (event) {
  console.log(
    'Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref
  )
  switch (event.path) {
    case '/app-api':
      runCmd('sh', ['./app-api.sh', event.payload.repository.name], function (text) { console.log(text) })
      break
    // case '/app2':
    //   runCmd('sh', ['./app2_deploy.sh', event.payload.repository.name], function (text) { console.log(text) })
    //   break
    default:
      // 处理其他
      break
  }
})

function runCmd (cmd, args, callback) {
  var spawn = require('child_process').spawn
  var child = spawn(cmd, args)
  var resp = ''
  child.stdout.on('data', function (buffer) {
    resp += buffer.toString()
  })
  child.stdout.on('end', function () {
    callback(resp)
  })
}