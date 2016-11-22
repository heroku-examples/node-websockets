'use strict';
app
    .factory('Socket', function (Toast, $window, $timeout) {
        var _this = { socket: $window.io() };
        _this.init = function () {
            _this.socket.on('chat message', function (msg) {
                if (msg == 'resource update'){
                    Toast.show(msg);
                    $timeout(function () {
                        $window.location.reload();
                    }, 1000);
                } else {
                    Toast.show('hello ' +  msg);
                }
            });
        };
        _this.send = function () {
            _this.socket.emit('chat message', $window.deviceCacheKey);
        };
        return _this;
    });
