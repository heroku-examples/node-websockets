app.config(function($stateProvider, $urlRouterProvider) {
        var dir = 'templates/';

        var states = {
            debug: {
                // templateProvider: function($templateCache) {
                //     // simplified, expecting that the cache is filled
                //     // there should be some checking... and async $http loading if not found
                //     return $templateCache.get('/templates/index/index.html');
                // },
                templateUrl : '/templates/debug/index.html',
                controller: 'DebugCtrl'
            },
            test: {
                // templateProvider: function($templateCache) {
                //     // simplified, expecting that the cache is filled
                //     // there should be some checking... and async $http loading if not found
                //     return $templateCache.get('/templates/index/index.html');
                // },
                templateUrl : '/templates/debug/test.html',
                controller: 'TestCtrl'
            },
            memo: {
                // templateProvider: function($templateCache) {
                //     // simplified, expecting that the cache is filled
                //     // there should be some checking... and async $http loading if not found
                //     return $templateCache.get('/templates/index/index.html');
                // },
                templateUrl : '/templates/debug/memo.html',
                controller: 'TestCtrl'
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
