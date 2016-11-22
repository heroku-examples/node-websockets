var server;
var io;
module.exports = {
    set: function (app, number) {
        server = require('http').createServer(app);
        io = require('socket.io').listen(server);

        io.on('connection', function (socket) {
            console.log('a user connected');

            socket.on('chat message', function (msg) {
                if (msg != number) {
                    io.emit('chat message', 'resource update');
                } else {
                    io.emit('chat message', msg);
                }
            });
        });
        return app;
    },
    getServer: function () {
        return server;
    }
};