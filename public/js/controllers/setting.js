app.$controllerProvider.register('SettingCtrl', function($window, $scope, $rootScope, $timeout, $stateParams, $localStorage, $mdMedia, $mdDialog, $mdBottomSheet, Toast, User, Json, Error, Pager, Loading, FriendRequest, FireBaseService) {
    $scope.useragent = $window.useragent;
});
