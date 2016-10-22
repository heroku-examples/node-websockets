app.config(function($stateProvider, $urlRouterProvider) {
        var dir = 'templates/';

        var states = {
            index: {
                // templateProvider: function($templateCache) {
                //     // simplified, expecting that the cache is filled
                //     // there should be some checking... and async $http loading if not found
                //     return $templateCache.get('/templates/index/index.html');
                // },
                templateUrl : '/templates/main/index.html?v=' + window.deviceCacheKey,
                controller: 'LoginCtrl'
            },
            signUp: {
                templateUrl : '/templates/main/signUp.html?v=' + window.deviceCacheKey,
                controller: 'LoginCtrl'
            },
            userUpdate : {
                templateUrl : '/templates/main/userUpdate.html?v=' + window.deviceCacheKey,
                controller: 'UserUpdateCtrl'
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
            })
            .state('userUpdate', {
                url: "/userUpdate",
                views: {
                    "main": states.userUpdate,
                }
            });
        $urlRouterProvider.otherwise('/index');
        $urlRouterProvider.when('', '/');
    });
