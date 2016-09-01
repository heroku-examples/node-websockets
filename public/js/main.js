var app = angular.module('StarterApp', ['ngMaterial', 'ngMdIcons', 'ngResource']);

app.controller('AppCtrl', ['$scope', '$mdBottomSheet', '$mdSidenav', '$mdDialog',
    function($scope, $mdBottomSheet, $mdSidenav, $mdDialog) {
        $scope.toggleSidenav = function(menuId) {
            $mdSidenav(menuId).toggle();
        };
        $scope.menu = [{
            link: '',
            title: 'Dashboard',
            icon: 'dashboard'
        }, {
            link: '',
            title: 'Friends',
            icon: 'group'
        }, {
            link: '',
            title: 'Messages',
            icon: 'message'
        }];
        $scope.admin = [{
            link: '',
            title: 'Trash',
            icon: 'delete'
        }, {
            link: 'showListBottomSheet($event)',
            title: 'Settings',
            icon: 'settings'
        }];
        $scope.activity = [{
            what: 'Brunch this weekend?',
            who: 'Ali Conners',
            when: '3:08PM',
            notes: " I'll be in your neighborhood doing errands"
        }, {
            what: 'Summer BBQ',
            who: 'to Alex, Scott, Jennifer',
            when: '3:08PM',
            notes: "Wish I could come out but I'm out of town this weekend"
        }, {
            what: 'Oui Oui',
            who: 'Sandra Adams',
            when: '3:08PM',
            notes: "Do you have Paris recommendations? Have you ever been?"
        }, {
            what: 'Birthday Gift',
            who: 'Trevor Hansen',
            when: '3:08PM',
            notes: "Have any ideas of what we should get Heidi for her birthday?"
        }, {
            what: 'Recipe to try',
            who: 'Brian Holt',
            when: '3:08PM',
            notes: "We should eat this: Grapefruit, Squash, Corn, and Tomatillo tacos"
        }, ];
        $scope.alert = '';
        $scope.showListBottomSheet = function($event) {
            $scope.alert = '';
            $mdBottomSheet.show({
                template: '<md-bottom-sheet class="md-list md-has-header"> <md-subheader>Settings</md-subheader> <md-list> <md-item ng-repeat="item in items"><md-item-content md-ink-ripple flex class="inset"> <a flex aria-label="{{item.name}}" ng-click="listItemClick($index)"> <span class="md-inline-list-icon-label">{{ item.name }}</span> </a></md-item-content> </md-item> </md-list></md-bottom-sheet>',
                controller: 'ListBottomSheetCtrl',
                targetEvent: $event
            }).then(function(clickedItem) {
                $scope.alert = clickedItem.name + ' clicked!';
            });
        };

        $scope.showAdd = function(ev) {
            $mdDialog.show({
                    controller: DialogController,
                    template: '<input id="m" autocomplete="off" /><button ng-click="send()">Send</button>',
                    targetEvent: ev,
                })
                .then(function(answer) {
                    $scope.alert = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.alert = 'You cancelled the dialog.';
                });
        };
    }
]);

app.controller('ListBottomSheetCtrl', function($scope, $mdBottomSheet) {
    $scope.items = [{
        name: 'Share',
        icon: 'share'
    }, {
        name: 'Upload',
        icon: 'upload'
    }, {
        name: 'Copy',
        icon: 'copy'
    }, {
        name: 'Print this page',
        icon: 'print'
    }, ];

    $scope.listItemClick = function($index) {
        var clickedItem = $scope.items[$index];
        $mdBottomSheet.hide(clickedItem);
    };
});

function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };

    var socket = io();

    $scope.send = function() {
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        $mdDialog.hide();
    };

    socket.on('chat message', function(msg) {
        $('#messages').append($('<li>').text(msg));
    });
}

app.directive('userAvatar', function() {
    return {
        replace: true,
        template: '<svg class="user-avatar" viewBox="0 0 128 128" height="64" width="64" pointer-events="none" display="block" > <path fill="#FF8A80" d="M0 0h128v128H0z"/> <path fill="#FFE0B2" d="M36.3 94.8c6.4 7.3 16.2 12.1 27.3 12.4 10.7-.3 20.3-4.7 26.7-11.6l.2.1c-17-13.3-12.9-23.4-8.5-28.6 1.3-1.2 2.8-2.5 4.4-3.9l13.1-11c1.5-1.2 2.6-3 2.9-5.1.6-4.4-2.5-8.4-6.9-9.1-1.5-.2-3 0-4.3.6-.3-1.3-.4-2.7-1.6-3.5-1.4-.9-2.8-1.7-4.2-2.5-7.1-3.9-14.9-6.6-23-7.9-5.4-.9-11-1.2-16.1.7-3.3 1.2-6.1 3.2-8.7 5.6-1.3 1.2-2.5 2.4-3.7 3.7l-1.8 1.9c-.3.3-.5.6-.8.8-.1.1-.2 0-.4.2.1.2.1.5.1.6-1-.3-2.1-.4-3.2-.2-4.4.6-7.5 4.7-6.9 9.1.3 2.1 1.3 3.8 2.8 5.1l11 9.3c1.8 1.5 3.3 3.8 4.6 5.7 1.5 2.3 2.8 4.9 3.5 7.6 1.7 6.8-.8 13.4-5.4 18.4-.5.6-1.1 1-1.4 1.7-.2.6-.4 1.3-.6 2-.4 1.5-.5 3.1-.3 4.6.4 3.1 1.8 6.1 4.1 8.2 3.3 3 8 4 12.4 4.5 5.2.6 10.5.7 15.7.2 4.5-.4 9.1-1.2 13-3.4 5.6-3.1 9.6-8.9 10.5-15.2M76.4 46c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6-.9 0-1.6-.7-1.6-1.6-.1-.9.7-1.6 1.6-1.6zm-25.7 0c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6-.9 0-1.6-.7-1.6-1.6-.1-.9.7-1.6 1.6-1.6z"/> <path fill="#E0F7FA" d="M105.3 106.1c-.9-1.3-1.3-1.9-1.3-1.9l-.2-.3c-.6-.9-1.2-1.7-1.9-2.4-3.2-3.5-7.3-5.4-11.4-5.7 0 0 .1 0 .1.1l-.2-.1c-6.4 6.9-16 11.3-26.7 11.6-11.2-.3-21.1-5.1-27.5-12.6-.1.2-.2.4-.2.5-3.1.9-6 2.7-8.4 5.4l-.2.2s-.5.6-1.5 1.7c-.9 1.1-2.2 2.6-3.7 4.5-3.1 3.9-7.2 9.5-11.7 16.6-.9 1.4-1.7 2.8-2.6 4.3h109.6c-3.4-7.1-6.5-12.8-8.9-16.9-1.5-2.2-2.6-3.8-3.3-5z"/> <circle fill="#444" cx="76.3" cy="47.5" r="2"/> <circle fill="#444" cx="50.7" cy="47.6" r="2"/> <path fill="#444" d="M48.1 27.4c4.5 5.9 15.5 12.1 42.4 8.4-2.2-6.9-6.8-12.6-12.6-16.4C95.1 20.9 92 10 92 10c-1.4 5.5-11.1 4.4-11.1 4.4H62.1c-1.7-.1-3.4 0-5.2.3-12.8 1.8-22.6 11.1-25.7 22.9 10.6-1.9 15.3-7.6 16.9-10.2z"/> </svg>'
    };
});

app.config(function($mdThemingProvider) {
    var customBlueMap = $mdThemingProvider.extendPalette('light-blue', {
        'contrastDefaultColor': 'light',
        'contrastDarkColors': ['50'],
        '50': 'ffffff'
    });
    $mdThemingProvider.definePalette('customBlue', customBlueMap);
    $mdThemingProvider.theme('default')
        .primaryPalette('customBlue', {
            'default': '500',
            'hue-1': '50'
        })
        .accentPalette('pink');
    $mdThemingProvider.theme('input', 'default')
        .primaryPalette('grey');
});

app.factory('User', function($resource) {
    return $resource('/api/users/:uid', {
        uid: '@uid'
    }, {
        get: {
            method: 'GET',
            isArray: true
        }, // apiの戻り値が配列の場合は「isArray: true」を指定する
        find: {
            method: 'GET',
            isArray: true
        },
        create: {
            method: 'POST',
            isArray: true
        },
        update: {
            method: 'PUT',
            isArray: true
        },
        delete: {
            method: 'DELETE',
            isArray: true
        }
    });
});

app.controller('ApiCtrl', function($scope, User) {

    var getRandomArbitary = function(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    };

    var getUsers = function() {
        User.get().$promise.then(function(users) {
            $scope.users = users.reverse();
            console.log($scope.users);
        }).catch(function(data, status) {
            alert('error');
        });
    };
    $scope.users = User.query();
    getUsers();

    $scope.createUser = function(userData) {
        userData.uid = getRandomArbitary(1, 100);
        User.create(userData).$promise.then(function(users) {
            getUsers();
            console.log($scope.users);
        }).catch(function(data, status) {
            alert('error');
        });
    };

    $scope.findUser = function(uid) {
        User.find({ 'uid': uid }).$promise.then(function(users) {
            $scope.users = users.reverse();
            console.log($scope.users);
        }).catch(function(data, status) {
            alert('error');
        });
    };

    $scope.deleteUser = function(uid) {
        User.delete({ 'uid': uid }).$promise.then(function(users) {
            getUsers();
            console.log($scope.users);
        }).catch(function(data, status) {
            alert('error');
        });
    };
});
