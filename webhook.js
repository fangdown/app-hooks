var http = require("http");
var createHandler = require("node-github-webhook");
var handler = createHandler([
  // 多个仓库
  {
    path: "/app-api-koa",
    secret: "fangdown",
  },
  {
    path: "/app-git123-ssr",
    secret: "fangdown",
  },
  {
    path: "/app-blog",
    secret: "fangdown",
  },
  {
    path: "/app-admin-vue",
    secret: "fangdown",
  },
  {
    path: "/app-video",
    secret: "fangdown",
  },
]);
// var handler = createHandler({ path: '/webhook1', secret: 'secret1' }) // 单个仓库

http
  .createServer(function (req, res) {
    handler(req, res, function (err) {
      res.statusCode = 404;
      res.end("no such location");
    });
  })
  .listen(11009, () => {
    console.log("webhook start on port 11009");
  });

handler.on("error", function (err) {
  console.error("Error:", err.message);
});

handler.on("push", function (event) {
  console.log(
    "Received a push event for %s to %s",
    event.payload.repository.name,
    event.payload.ref
  );
  console.log(`${event.path}`);
  switch (event.path) {
    case "/app-api-koa":
      runCmd(
        "sh",
        ["./app-api-koa.sh", event.payload.repository.name],
        function (text) {
          console.log(text);
        }
      );
      break;
    case "/app-blog":
      runCmd(
        "sh",
        ["./app-blog.sh", event.payload.repository.name],
        function (text) {
          console.log(text);
        }
      );
      break;
    case "/app-git123-ssr":
      runCmd(
        "sh",
        ["./app-git123-ssr.sh", event.payload.repository.name],
        function (text) {
          console.log(text);
        }
      );
      break;
    case "/app-admin-vue":
      runCmd(
        "sh",
        ["./app-admin-vue.sh", event.payload.repository.name],
        function (text) {
          console.log(text);
        }
      );
      break;
    case "/app-video":
      runCmd(
        "sh",
        ["./app-video.sh", event.payload.repository.name],
        function (text) {
          console.log(text);
        }
      );
      break;
    default:
      // 处理其他
      break;
  }
});

function runCmd(cmd, args, callback) {
  var spawn = require("child_process").spawn;
  var child = spawn(cmd, args);
  var resp = "";
  child.stdout.on("data", function (buffer) {
    resp += buffer.toString();
  });
  child.stdout.on("end", function () {
    callback(resp);
  });
}
