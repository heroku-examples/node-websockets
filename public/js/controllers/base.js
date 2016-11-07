app.controller('AppCtrl', function ($scope, $window, $timeout, Toast, $location, $rootScope, $mdMedia, $mdBottomSheet, $mdSidenav, $mdDialog, $sessionStorage, FireBaseService, Login) {
    $scope.sessionStorage = $sessionStorage;
    $scope.mdMedia = $mdMedia;
    $scope.deviceCacheKey = window.deviceCacheKey;
    $scope.toggleSidenav = function (menuId) {
        $timeout(function () {
            $mdSidenav(menuId).toggle();
        }, false);
    };
    $scope.getUrlWithCacheNumber = function (path) {
        return path + window.deviceCacheKey;
    };
    $scope.menu = [{
        link: '/main#/',
        title: 'Main',
        icon: 'dashboard'
    }, {
        link: location.pathname + '#friend',
        title: 'Friend',
        icon: 'group'
    }, {
        link: location.pathname + '#userUpdate',
        title: 'User Update',
        icon: 'group'
    }, {
        link: location.pathname + '#setting',
        title: 'setting',
        icon: 'group'
    }, {
        link: '/index#/',
        title: 'Index',
        icon: 'group'
    }, {
        link: '',
        title: 'Messages',
        icon: 'message'
    }, {
        link: '',
        title: 'Settings',
        icon: 'settings'
    }];
    $scope.admin = [{
        link: '/debug',
        title: 'Debug',
        icon: 'adb'
    }, {
        link: '/debug#/memo',
        title: 'Memo',
        icon: 'adb'
    }];

    $scope.alert = '';

    $scope.checkButtonClick = function (type) {
        if ($sessionStorage.token) {
            Login.logOut();
        } else {
            Login.login(type);
        }
    };

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (toParams.value || toParams.key) {
            $sessionStorage.toParams = {
                value: toParams.value,
                key: toParams.key
            };
        }
        $sessionStorage.fromState = fromState;

        // if (toState.name == 'login' || toState.name == 'blog' || toState.name == 'blogList') return;
        // if (!Login.checkUser()) {
        //     event.preventDefault();
        //     Link.goBlogList();
        // }
        // Theme.changeTheme('default');
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        var currentUser = Login.getUser();
        if (currentUser) {
            if (!$scope.message && currentUser.uid) {
                $scope.messages = FireBaseService.getArrayRef('/notify/' + currentUser.uid, 'messages');
                $scope.messages.$watch(function () {
                    Toast.show($scope.messages[0].text);
                });
            }
        }
    });

    // Check if a new cache is available on page load.
    $window.addEventListener('load', function (e) {

        $window.applicationCache.addEventListener('updateready', function (e) {
            if ($window.applicationCache.status == $window.applicationCache.UPDATEREADY) {
                // Browser downloaded a new app cache.
                // Swap it in and reload the page to get the new hotness.
                $window.applicationCache.swapCache();
                if (confirm('A new version of this site is available. Load it?')) {
                    $window.location.reload();
                }
            } else {
                // Manifest didn't changed. Nothing new to server.
            }
        }, false);

    }, false);
    // $scope.openAdd = function(ev) {
    //     $mdDialog.show({
    //             controller: DialogController,
    //             template: '<input id="m" autocomplete="off" /><button ng-click="send()">Send</button>',
    //             targetEvent: ev,
    //         })
    //         .then(function(answer) {
    //             $rootScope.$broadcast('xxxxxEvent', answer);
    //         }, function() {
    //             $scope.alert = 'You cancelled the dialog.';
    //         });
    // };
});
