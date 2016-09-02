app.controller('AppCtrl', function($scope, $rootScope, $mdBottomSheet, $mdSidenav, $mdDialog) {
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

        $scope.openAdd = function(ev) {
            $mdDialog.show({
                    controller: DialogController,
                    template: '<input id="m" autocomplete="off" /><button ng-click="send()">Send</button>',
                    targetEvent: ev,
                })
                .then(function(answer) {
                    $rootScope.$broadcast('xxxxxEvent', answer);
                }, function() {
                    $scope.alert = 'You cancelled the dialog.';
                });
        };

        $scope.openSearch = function(ev) {
            $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'templates/user_condition.html',
                    targetEvent: ev,
                })
                .then(function(answer) {
                    $rootScope.$broadcast('UserSearchEvent', answer);
                }, function() {
                    $scope.alert = 'You cancelled the dialog.';
                });
        };
    }
);

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
    $scope.search = function() {
        console.log($scope.userCondition);
        $mdDialog.hide($scope.userCondition);
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
