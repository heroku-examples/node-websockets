app.factory('Json', function($http, $q, $localStorage) {

        if (!$localStorage.json) {
            $localStorage.json = {};
        }

        var _this = {
            isLoding: false,
            preloadUrls: [
                '/api/files/profile',
                '/api/files/location',
                "/api/files/lang/" + document.documentElement.lang
            ],
        }
     _this.get = function(path) {
            var d = $q.defer();
            if ($localStorage.json[path]) {
                d.resolve($localStorage.json[path]);
            } else {
                $http.get(path)
                    .then(function(response) {
                        //First function handles success
                        $localStorage.json[path] = response.data;
                        d.resolve(response.data);
                    }, function(response) {
                        //Second function handles error
                        d.resolve(null);
                    });
            }
            return d.promise;
        };
        _this.deleteStorageAll = function() {
            $localStorage.json = {};
        };
        _this.deleteTargetUserCondition = function() {
            $localStorage.targetUserCondition = false;
        };


        angular.forEach(_this.preloadUrls, function(value, key) {
            if (!$localStorage[value]) {
                _this.get(value).then(function(details) {
                    $localStorage[value] = details;
                });
            }
        });

        return _this;
    })
    .factory('Toast', function($mdToast) {
        var _this = {};
        _this.show = function(text) {
            $mdToast.show($mdToast.simple().content(text).position('bottom'));
        };
        return _this;
    });
