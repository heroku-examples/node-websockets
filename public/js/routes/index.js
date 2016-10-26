app.config(function( $stateProvider, $urlRouterProvider ) {


        var dir = 'templates/';

        var states = {
            index: {
                // templateProvider: function($templateCache) {
                //     // simplified, expecting that the cache is filled
                //     // there should be some checking... and async $http loading if not found
                //     return $templateCache.get('/templates/index/index.html');
                // },
                templateUrl : '/templates/index/index.html?v=' + window.deviceCacheKey,
                controller: 'ApiCtrl'
            },
            friend: {
                // templateProvider: function($templateCache) {
                //     // simplified, expecting that the cache is filled
                //     // there should be some checking... and async $http loading if not found
                //     return $templateCache.get('/templates/index/index.html');
                // },
                templateUrl : '/templates/index/friend.html?v=' + window.deviceCacheKey,
                controller: 'FriendCtrl'
            },
            chat: {
                // templateProvider: function($templateCache) {
                //     // simplified, expecting that the cache is filled
                //     // there should be some checking... and async $http loading if not found
                //     return $templateCache.get('/templates/index/index.html');
                // },
                templateUrl : '/templates/index/chat.html?v=' + window.deviceCacheKey,
                controller: 'ChatCtrl',
                params: {
                    requestFromUid: null,
                    requestUid: null
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
                params: {
                    key: null,
                    value: null
                }
            })
            .state('chat', {
                url: "/chat",
                views: {
                    "main": states.chat,
                },
                params: states.chat.params
            });
        $urlRouterProvider.otherwise('/index');
        $urlRouterProvider.when('', '/');
    });
