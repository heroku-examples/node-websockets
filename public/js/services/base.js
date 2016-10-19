app.factory('Json', function($http, $q, $localStorage) {



        var _this = {
            isLoding: false,
            preloadUrls: {
                "profile": { url: '/json/profile.json' },
                "location": { url: '/json/prefectures.json' },
                "lang": { url: "/json/lang_" + document.documentElement.lang + '.json' }
            },
        };

        var versionCheck = function() {
            if (!$localStorage.json) {
                $localStorage.json = {};
            }
            $http.get('/json/settings.json')
                .then(function(response) {
                    var targetVersion = response.data.localStorage.versions.cache;
                    //First function handles success
                    if (targetVersion == $localStorage.json.version) return;
                    angular.forEach(_this.preloadUrls, function(value, key) {
                        _this.get(key, value.url).then(function(details) {});
                    });
                    $localStorage.json['version'] = targetVersion;
                }, function(response) {
                    console.log(response);
                });
        };


        _this.get = function(name, path) {
            var d = $q.defer();
            if ($localStorage.json[name]) {
                d.resolve($localStorage.json[name]);
            } else {
                if (!path) {
                    d.resolve(null);
                } else {
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

        versionCheck();

        return _this;
    })
    .factory('Toast', function($mdToast) {
        var _this = {};
        _this.show = function(text) {
            $mdToast.show($mdToast.simple().content(text).position('bottom'));
        };
        return _this;
    });
