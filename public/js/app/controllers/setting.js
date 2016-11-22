app.$controllerProvider.register('SettingCtrl', function ($window, $scope, $rootScope, $timeout, $stateParams, $localStorage, $mdMedia, $mdDialog, $mdBottomSheet, Toast, User, Json, Error, Pager, Loading, FriendRequest, FireBaseService, Worker) {
    $scope.useragent = $window.useragent;

    $scope.isPushEnabled = $localStorage.setting.isPushEnabled
    $scope.pushDisabled = $localStorage.setting.pushDisabled;

    var changePushSetting = function(){
       if ($scope.isPushEnabled) {
            if ($scope.pushDisabled == true) {
                Toast.show("pushDisabled");
            } else {
                Toast.show("pushEnabled");
            }
            Worker.init();
        }
    }
    var countIsPushEnabled = 0
    var countIsPushDisabled = 0
    $scope.$watch('isPushEnabled', function (newVal, oldVal) {
        $localStorage.setting.isPushEnabled = newVal;
        //changePushSetting();
    });
    $scope.$watch('pushDisabled', function (newVal, oldVal) {
        $localStorage.setting.pushDisabled = newVal;
        if(countIsPushDisabled)changePushSetting();
        countIsPushDisabled++
    });
});
