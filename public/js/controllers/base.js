app.controller('AppCtrl', function ($scope,
    $window,
    $timeout,
    Toast,
    Vibration,
    Speech,
    $location,
    $rootScope,
    $mdMedia,
    $mdBottomSheet,
    $mdSidenav,
    $mdDialog,
    $sessionStorage,
    $localStorage,
    $state,
    FireBaseService,
    FriendRequest,
    Loading,
    Worker,
    Modal,
    Manifest,
    Login) {
    $scope.sessionStorage = $sessionStorage;
    $scope.$storage = $localStorage;
    $scope.mdMedia = $mdMedia;
    $scope.loading = Loading;
    $scope.deviceCacheKey = window.deviceCacheKey;
    Worker.init('simple')
    // .postMessage('test').then(function(data) {
    //     console.log(data)
    // });
    Manifest.init();

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
        link: '/debug#/',
        title: 'Debug',
        icon: 'adb'
    }, {
        link: '/debug#/memo',
        title: 'Memo',
        icon: 'adb'
    }];

    var getFriends = function () {
        Loading.start();
        FriendRequest.friends().get().$promise.then(function (result) {
            if (result) {
                if (result.docs) {
                    $sessionStorage.requests = result.docs.requests;
                    $sessionStorage.friends = result.docs.friends;
                }
            }
            console.log($sessionStorage.requests)
            console.log($sessionStorage.friends)
        }).catch(function (data, status) {
            Loading.finish();
            Error.openMessage(data, status);
        });
    };

    $scope.alert = '';

    $scope.checkButtonClick = function (type) {
        if ($sessionStorage.token) {
            Login.logOut();
        } else {
            Login.login(type);
        }
    };

    $scope.init = function () {
        getFriends();
    }

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
        $scope.currentUser = Login.getUser();
        if ($scope.currentUser) {
            if (!$scope.messages && $sessionStorage.requests) {
                // $scope.messages = FireBaseService.getArrayRef('/notify/' + $scope.currentUser.uid, 'messages');
                // $scope.messages.$watch(function () {
                //     Toast.show($scope.messages[$scope.messages.length - 1].text + $scope.messages[$scope.messages.length - 1].createDate);
                // });
                $scope.messages = [];
                angular.forEach($sessionStorage.requests, function (request, key) {
                    $scope.messages[key] = FireBaseService.getObjectRef('/private_chats/' + request.url + '/unread/' + $scope.currentUser.uid);
                    $scope.messages[key].$watch(function () {
                        if ($scope.messages[key].count) {
                            var friendUid = (request.uid == $scope.currentUser.uid) ? request.fromUid : request.uid;
                            Toast.show($scope.messages[key].text + ' from ' + $sessionStorage.friends[friendUid].firstName);
                            Vibration.play();
                            if($state.current.name !== 'signUp') Speech.play($scope.messages[key].text);
                        }
                    });
                });
            }
        }
        $mdSidenav('left').close();
    });

    $window.onhashchange = function() {
        Modal.close();
    };
});
