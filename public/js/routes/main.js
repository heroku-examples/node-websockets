app.config(function($stateProvider, $urlRouterProvider) {
        var dir = 'templates/';

        var states = {
            index: {
                // templateProvider: function($templateCache) {
                //     // simplified, expecting that the cache is filled
                //     // there should be some checking... and async $http loading if not found
                //     return $templateCache.get('/templates/index/index.html');
                // },
                templateUrl : '/templates/main/index.html',
                controller: 'LoginCtrl'
            },
            signUp: {
                // templateProvider: function($templateCache) {
                //     // simplified, expecting that the cache is filled
                //     // there should be some checking... and async $http loading if not found
                //     return $templateCache.get('/templates/index/index.html');
                // },
                templateUrl : '/templates/main/signUp.html',
                controller: 'LoginCtrl'
            }
        };
        $stateProvider
            .state('index', {
                url: "/",
                views: {
                    "main": states.index,
                }
            })
            .state('signUp', {
                url: "/signUp",
                views: {
                    "main": states.signUp,
                }
            });
        $urlRouterProvider.otherwise('/index');
        $urlRouterProvider.when('', '/');
    });
