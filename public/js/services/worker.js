app
    .factory('Worker', function($q) {
        var _this = {
            worker: {},
            resouces: {
                simple: '/task.js?v=' + window.deviceCacheKey
            }
        };

        _this.init = function(resouceName) {
            // this.worker = new Worker(_this.resouces[resouceName]);
            navigator.serviceWorker.register(_this.resouces[resouceName]);
            navigator.serviceWorker.ready
                .then(function(registration) {
                    return registration.pushManager.subscribe({ userVisibleOnly: true });
                })
                .then(function(subscription) {
                    console.log(subscription)
                    console.log(`GCM EndPoint is: ${subscription.endpoint}`);
                })
                .catch(console.error.bind(console));
        };
        _this.postMessage = function(data) {
            // var d = $q.defer();
            // this.worker.postMessage(data);
            // this.worker.addEventListener('message', function (e) {
            //     d.resolve(e.data);
            // }, false);
            // return d.promise;
        };
        return _this;
    });

