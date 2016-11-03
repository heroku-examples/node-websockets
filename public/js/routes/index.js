app.config(function ($stateProvider, $urlRouterProvider) {


    var dir = 'templates/';

    var states = {
        index: {
            // templateProvider: function($templateCache) {
            //     // simplified, expecting that the cache is filled
            //     // there should be some checking... and async $http loading if not found
            //     return $templateCache.get('/templates/index/index.html');
            // },
            controller: 'IndexCtrl',
            templateProvider: function () {
                return lazyDeferred.promise;
            },
            resolve: {
                load: function ($ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load('index').then(function () {
                        return $http.get('/templates/index/index.html?v=' + window.deviceCacheKey)
                            .success(function (data, status, headers, config) {
                                return lazyDeferred.resolve(data);
                            }).
                            error(function (data, status, headers, config) {
                                return lazyDeferred.resolve(data);
                            });
                    });

                }
            }
        },
        friend: {
            // templateProvider: function($templateCache) {
            //     // simplified, expecting that the cache is filled
            //     // there should be some checking... and async $http loading if not found
            //     return $templateCache.get('/templates/index/index.html');
            // },
            controller: 'FriendCtrl',
            templateProvider: function () {
                return lazyDeferred.promise;
            },
            resolve: {
                load: function ($ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load('friend').then(function () {
                        return $http.get('/templates/index/friend.html?v=' + window.deviceCacheKey)
                            .success(function (data, status, headers, config) {
                                return lazyDeferred.resolve(data);
                            }).
                            error(function (data, status, headers, config) {
                                return lazyDeferred.resolve(data);
                            });
                    });

                }
            },
            // data: {
            //     public: true
            // }
        },
        setting: {
            controller: 'SettingCtrl',
            templateProvider: function () {
                return lazyDeferred.promise;
            },
            resolve: {
                load: function ($ocLazyLoad, $q, $http) {
                    lazyDeferred = $q.defer();
                    return $ocLazyLoad.load('setting').then(function () {
                        return $http.get('/templates/index/setting.html?v=' + window.deviceCacheKey)
                            .success(function (data, status, headers, config) {
                                return lazyDeferred.resolve(data);
                            }).
                            error(function (data, status, headers, config) {
                                return lazyDeferred.resolve(data);
                            });
                    });

                }
            }
        }
    };
    $stateProvider
        .state('index', {
            url: "/",
            views: {
                "main": states.index,
            }
        })
        .state('friend', {
            url: "/friend",
            views: {
                "main": states.friend,
            },
        })
        .state('setting', {
            url: "/setting",
            views: {
                "main": states.setting,
            }
        });
    $urlRouterProvider.otherwise('/index');
    $urlRouterProvider.when('', '/');
});