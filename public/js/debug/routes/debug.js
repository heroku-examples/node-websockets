app.config(function ($stateProvider, $urlRouterProvider) {
    var dir = 'templates/';

    var states = {
        index: {
            // templateProvider: function($templateCache) {
            //     // simplified, expecting that the cache is filled
            //     // there should be some checking... and async $http loading if not found
            //     return $templateCache.get('/templates/index/index.html');
            // },
            templateUrl: '/templates/debug/index.html?v=' + window.deviceCacheKey,
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('debug'); // Resolve promise and load before view 
                }]
            }
        },
        test: {
            // templateProvider: function($templateCache) {
            //     // simplified, expecting that the cache is filled
            //     // there should be some checking... and async $http loading if not found
            //     return $templateCache.get('/templates/index/index.html');
            // },
            templateUrl: '/templates/debug/test.html?v=' + window.deviceCacheKey,
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('test'); // Resolve promise and load before view 
                }]
            }
        },
        memo: {
            // templateProvider: function($templateCache) {
            //     // simplified, expecting that the cache is filled
            //     // there should be some checking... and async $http loading if not found
            //     return $templateCache.get('/templates/index/index.html');
            // },
            templateUrl: '/templates/debug/memo.html?v=' + window.deviceCacheKey,
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('test'); // Resolve promise and load before view 
                }]
            }
        }
    };
    angular.forEach(states, function (state, stateKey) {
        states[stateKey].templateProvider = function () {
            return lazyDeferred.promise;
        };
        states[stateKey].resolve.load = function ($ocLazyLoad, $q, $http) {
            lazyDeferred = $q.defer();
            return $ocLazyLoad.load(stateKey).then(function () {
                return $http.get( state.path.templateUrl)
                    .success(function (data, status, headers, config) {
                        return lazyDeferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        return lazyDeferred.resolve(data);
                    });
            });
        };
        $stateProvider
            .state(stateKey, {
                url: '/' +stateKey,
                views: {
                    "main": states[stateKey]
                }
            });
    });
    $urlRouterProvider.otherwise('/index');
    $urlRouterProvider.when('', '/index');
});
