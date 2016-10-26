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
            setting: {
                // templateProvider: function($templateCache) {
                //     // simplified, expecting that the cache is filled
                //     // there should be some checking... and async $http loading if not found
                //     return $templateCache.get('/templates/index/index.html');
                // },
                templateUrl : '/templates/index/setting.html?v=' + window.deviceCacheKey,
                controller: 'SettingCtrl',

                //ui-sref="chat({requestFromUid: getRequest(rangeIndex, infiniteItemIndex).friend_request.fromUid, requestUid: getRequest(rangeIndex, infiniteItemIndex).friend_request.uid})"
                // params: {
                //     requestFromUid: null,
                //     requestUid: null
                // }
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
