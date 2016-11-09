app
    .factory('Worker', function ($q) {
        var _this = {
            worker: {},
            resouces: {
                simple: '/js/workers/task.js'
            }
        };
        _this.init = function (resouceName) {
            this.worker = new Worker(_this.resouces[resouceName]);
            return this;
        };
        _this.postMessage = function (data) {
            var d = $q.defer();
            this.worker.postMessage(data);
            this.worker.addEventListener('message', function (e) {
                d.resolve(e.data);
            }, false);
            return d.promise;
        };
        return _this;
    });

