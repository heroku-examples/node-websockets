app.factory('Json', function ($http, $q, $localStorage) {



    var _this = {
        isLoding: false,
        preloadUrls: {
            "profile": { url: '/json/profile.json' },
            "location": { url: '/json/prefectures.json' },
            "lang": { url: "/json/lang_" + document.documentElement.lang + '.json' }
        },
    };

    var versionCheck = function () {
        if (!$localStorage.json) {
            $localStorage.json = {};
        }
        $http.get('/json/settings.json')
            .then(function (response) {
                var targetVersion = response.data.localStorage.versions.cache;
                //First function handles success
                if (targetVersion == $localStorage.json.version) return;
                angular.forEach(_this.preloadUrls, function (value, key) {
                    _this.get(key, value.url).then(function (details) { });
                });
                $localStorage.json.version = targetVersion;
            }, function (response) {
                console.log(response);
            });
    };


    _this.get = function (name, path) {
        var d = $q.defer();
        if ($localStorage.json[name]) {
            d.resolve($localStorage.json[name]);
        } else {
            if (!path) {
                d.resolve(null);
            } else {
                $http.get(path)
                    .then(function (response) {
                        //First function handles success
                        $localStorage.json[name] = response.data;
                        d.resolve(response.data);
                    }, function (response) {
                        //Second function handles error
                        d.resolve(null);
                    });
            }
        }
        return d.promise;
    };
    _this.deleteStorageAll = function () {
        $localStorage.json = {};
    };
    _this.deleteTargetUserCondition = function () {
        $localStorage.targetUserCondition = false;
    };

    versionCheck();

    return _this;
})
    .factory('Toast', function ($mdToast) {
        var _this = {};
        _this.show = function (text) {
            $mdToast.show($mdToast.simple().content(text).position('top'));
        };
        return _this;
    })
    .factory('Pager', function ($mdToast) {
        var _this = {};
        _this.getDefault = function () {
            return {
                length: 0,
                limit: 0,
                page: 0,
                pages: 0,
                total: 0
            };
        };
        _this.get = function (result) {
            if (result.isEmpty) {
                return _this.getDefault();
            } else {
                return {
                    length: result.docs.length,
                    limit: result.limit,
                    page: result.page,
                    pages: result.pages,
                    total: result.total
                };
            }

        };
        return _this;
    })
    .factory('Manifest', function ($window, $localStorage) {
        var _this = {};
        var appCache = $window.applicationCache;
        var cacheStatus = function (status) {
            switch (status) {
                case 0:
                    return 'UNCACHED';
                    break;
                case 1:
                    return 'IDLE';
                    break;
                case 2:
                    return 'CHECKING';
                    break;
                case 3:
                    return 'DOWNLOADING';
                    break;
                case 4:
                    return 'UPDATEREADY';
                    break;
                case 5:
                    return 'OBSOLETE';
                    break;
                case 6:
                    return 'CACHED';
                    break;
                default:
                    return 'UKNOWN CACHE STATUS';
                    break;
            };
        };
        var handleCacheEvent = function (e) {
            console.log(cacheStatus(appCache.status), e.type);
            if (appCache.status == appCache.UPDATEREADY) {
                // Browser downloaded a new app cache.
                // Swap it in and reload the page to get the new hotness.
                appCache.swapCache();
                if (confirm('A new version of this site is available. Load it?')) {
                    $window.location.reload();
                }
            } else if(appCache.status == appCache.CACHED){
                // Manifest didn't changed. Nothing new to server.
                if($window.deviceCacheKey != $localStorage.deviceCacheKey){
                    appCache.update();
                    $localStorage.deviceCacheKey = $window.deviceCacheKey;
                }
            }
        };
        var handleCacheError = function (e) {
            console.log('Error: Cache failed to update!');
        };

        _this.init = function () {

            // Check if a new cache is available on page load.
            $window.addEventListener('load', function (e) {
                appCache.addEventListener('applicationCache cached', handleCacheEvent, false);
                appCache.addEventListener('applicationCache checking', handleCacheEvent, false);
                appCache.addEventListener('applicationCache downloading', handleCacheEvent, false);
                appCache.addEventListener('applicationCache error', handleCacheError, false);
                appCache.addEventListener('applicationCache noupdate', handleCacheEvent, false);
                appCache.addEventListener('applicationCache obsolete', handleCacheEvent, false);
                appCache.addEventListener('applicationCache progress', handleCacheEvent, false);
                appCache.addEventListener('applicationCache updateready', handleCacheEvent, false);
            }, false);
        };
        return _this;
    })
