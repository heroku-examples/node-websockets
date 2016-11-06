app.controller('AppCtrl', function($scope, $window, Toast, $location, $rootScope, $mdMedia, $mdBottomSheet, $mdSidenav, $mdDialog, $sessionStorage, FireBaseService, Login) {
        $scope.sessionStorage = $sessionStorage;
        $scope.mdMedia = $mdMedia;
        $scope.deviceCacheKey = window.deviceCacheKey;
        $scope.toggleSidenav = function(menuId) {
            $mdSidenav(menuId).toggle();
        };
        $scope.getUrlWithCacheNumber = function(path){
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
            link: location.pathname +'#userUpdate',
            title: 'User Update',
            icon: 'group'
        }, {
            link: location.pathname + '#setting',
            title: 'setting',
            icon: 'group'
        },  {
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

        

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
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

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            var currentUser = Login.getUser();
            if(!$scope.message && currentUser.uid) {
                $scope.messages = FireBaseService.getArrayRef('/notify/' + currentUser.uid, 'messages');
                $scope.messages.$watch(function() {
                    Toast.show($scope.messages[0].text);
                });
            }
            console.log($scope.messages)
        });

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
    }
);
