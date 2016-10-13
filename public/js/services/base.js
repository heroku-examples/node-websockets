app.factory('Json', function($http, $q, $localStorage) {

        if (!$localStorage.json) {
            $localStorage.json = {};
        }

        var _this = {
            isLoding: false,
            preloadUrls: {
                "profile": { url : '/api/files/profile'},
                "location": { url : '/api/files/location'},
                "lang": { url : "/json/lang_" + document.documentElement.lang + '.json'}
            },
        };
        _this.get = function(name, path) {
            var d = $q.defer();
            if ($localStorage.json[name]) {
                d.resolve($localStorage.json[name]);
            } else {
                if( !path ){
                    d.resolve(null);
                }else{
                    $http.get(path)
                        .then(function(response) {
                            //First function handles success
                            $localStorage.json[name] = response.data;
                            d.resolve(response.data);
                        }, function(response) {
                            //Second function handles error
                            d.resolve(null);
                        });
                    }
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
            if (!$localStorage.json[key]) {
                _this.get(value.url).then(function(details) {
                    $localStorage.json[key] = details;
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
