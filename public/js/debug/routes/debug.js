app.config(function ($stateProvider, $urlRouterProvider) {
    var dir = 'templates/';

    var states = {
        debug: {
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
    $stateProvider
        .state('index', {
            url: "/",
            views: {
                "main": states.debug,
            }
        })
        .state('test', {
            url: "/test",
            views: {
                "main": states.test,
            }
        })
        .state('memo', {
            url: "/memo",
            views: {
                "main": states.memo,
            }
        });
    $urlRouterProvider.otherwise('/index');
    $urlRouterProvider.when('', '/');
});
