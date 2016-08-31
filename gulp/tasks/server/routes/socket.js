var http = require('http');
//サーバインスタンス作成
var server = http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end('server connected');
});
var io = require('socket.io').listen(server);

  server.listen(8888);//8888番ポートで起動

  //接続確立時の処理
  io.sockets.on('connection', function (socket) {
    // この中でデータのやり取りを行う
    // 「message」という名前で受信したデータはこの中を通る
    socket.on('message', function(d){
      // そのまま全接続先へ送信
      io.emit('receiveMessage', d);
    });
  });

module.exports = io;