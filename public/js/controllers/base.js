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
    Configs,
    Banner,
    Manifest,
    Login) {
    $scope.sessionStorage = $sessionStorage;
    $scope.$storage = $localStorage;
    $scope.mdMedia = $mdMedia;
    $scope.loading = Loading;
    $scope.deviceCacheKey = window.deviceCacheKey;
    $scope.configs = Configs;

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
    $scope.menu = [
    //     {
    //     link: '/main#/',
    //     title: 'Main',
    //     icon: 'dashboard'
    // },  
    {
        link: '/index#/',
        title: 'index',
        key : "index",
        icon: 'group'
    },
    {
        link: '/index#friend',
        title: 'friend',
        key : "friend",
        icon: 'group'
    }, {
        link: location.pathname + '#userUpdate',
        title: 'User Update',
        key : "userUpdate",
        icon: 'group'
    }, {
        link: '/index#setting',
        title: 'setting',
        key : "setting",
        icon: 'settings'
    },
    //  {
    //     link: '',
    //     title: 'Messages',
    //     icon: 'message'
    // }
    ];
    $scope.admin = [{
        link: '/debug#',
        title: 'debug',
        key : "debug",
        icon: 'adb'
    }, {
        link: '/debug#memo',
        title: 'memo',
        key : "memo",
        icon: 'adb'
    },{
        link: '/debug#test',
        title: 'test',
        key : "test",
        icon: 'adb'
    }];

    var getFriends = function () {
        Loading.start();
        FriendRequest.friends().get().$promise.then(function (result) {
            if (result) {
                if (result.docs) {
                    $sessionStorage.requests = result.docs.requests;
                }
            }
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
        Loading.stateChangeStart();
        if (toParams.value || toParams.key) {
            $sessionStorage.toParams = {
                value: toParams.value,
                key: toParams.key
            };
        }
        $sessionStorage.fromState = fromState;
        $sessionStorage.toState = toState;

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
            if(!$window.friendRequestInfo) return;
            if (!$scope.messages && $window.friendRequestInfo.requestInfos && $window.friendRequestInfo.userInfos && location.pathname.includes('/index')) {
                Worker.init('simple');
                $scope.messages = [];
                angular.forEach($window.friendRequestInfo.requestInfos, function (request, key) {
                    $scope.messages[key] = FireBaseService.getObjectRef('/private_chats/' + request.url + '/unread/' + $scope.currentUser.uid);
                    $scope.messages[key].$watch(function () {
                        if ($scope.messages[key].count) {
                            var friendUid = (request.uid == $scope.currentUser.uid) ? request.fromUid : request.uid;
                            Toast.show($scope.messages[key].text + ' from ' + $window.friendRequestInfo.userInfos[friendUid].firstName);
                            Vibration.play();
                            Speech.play($scope.messages[key].text);
                        }
                    });
                });
                Loading.sateChangeFinish();
            }
        }
        $mdSidenav('left').close();
    });

    $window.onhashchange = function() {
        Modal.close();
    };

    Banner.all.get().$promise.then(function (result) {
        $scope.banners = result.docs;
    }).catch(function (data, status) {
    });
});
