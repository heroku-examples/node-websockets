var server;
var io;
module.exports = {
    set: function (app) {
        server  = require('http').createServer(app);
        io = require('socket.io').listen(server);

        io.on('connection', function(socket){
          console.log('a user connected');
          socket.on('chat message', function(msg){
            io.emit('chat message', msg);
          });
        });
        return app;
    },
    getServer : function () {
        return server;
    }
};