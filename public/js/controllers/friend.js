app.controller('FriendCtrl', function($window, $scope, $rootScope, $stateParams, $sessionStorage, $localStorage, $mdDialog, User, UserFind, Json, Link, Loading) {
    var id = $stateParams.value ? $stateParams.value.uid : $sessionStorage.toParams.value.uid;
});