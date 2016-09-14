app.controller('AppCtrl', function($scope, $rootScope, $mdBottomSheet, $mdSidenav, $mdDialog, $sessionStorage, FireBaseService) {
        $scope.toggleSidenav = function(menuId) {
            $mdSidenav(menuId).toggle();
        };
        $scope.menu = [{
            link: '/main',
            title: 'Main',
            icon: 'dashboard'
        }, {
            link: '/index',
            title: 'Index',
            icon: 'group'
        }, {
            link: '',
            title: 'Messages',
            icon: 'message'
        }];
        $scope.admin = [{
            link: '/debug',
            title: 'Debug',
            icon: 'adb'
        }, {
            link: 'showListBottomSheet($event)',
            title: 'Settings',
            icon: 'settings'
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
