app.config(function ($stateProvider, $urlRouterProvider) {
    var dir = '/templates/';

    var states = {
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
            path: {
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
    $stateProvider
        .state('/index', {
            url: "",
            views: {
                "main": states.signUp,
            }
        });

    $urlRouterProvider.otherwise('/signUp');
    $urlRouterProvider.when('', '/signUp');
});
