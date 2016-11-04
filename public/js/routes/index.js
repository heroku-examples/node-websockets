app.config(function ($stateProvider, $urlRouterProvider) {


    var dir = '/templates/';

    var states = {
        index: {
            controller: 'IndexCtrl',
            resolve: {},
            path: {
                templateUrl: dir + 'index/index.html?v=' + window.deviceCacheKey,
            }
        },
        friend: {
            controller: 'FriendCtrl',
            resolve: {},
            path: {
                templateUrl: dir + 'index/friend.html?v=' + window.deviceCacheKey,
            }
        },
        setting: {
            controller: 'SettingCtrl',
            resolve: {},
            path: {
                templateUrl: dir + 'index/setting.html?v=' + window.deviceCacheKey,
            }
        },
        signUp: {
            controller: 'LoginCtrl',
            resolve: {},
            path: {
                templateUrl: dir + 'main/signUp.html?v=' + window.deviceCacheKey,
            }
        },
        userUpdate: {
            controller: 'UserUpdateCtrl',
            resolve: {},
            path :{
                templateUrl: dir + 'main/userUpdate.html?v=' + window.deviceCacheKey,
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
    $urlRouterProvider.otherwise('/signUp');
    $urlRouterProvider.when('', '/signUp');
});