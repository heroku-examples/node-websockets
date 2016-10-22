app.controller('DebugCtrl', function($scope,
    Profile,
    SyncProfile,
    Location,
    SyncLocation,
    LangJa,
    SyncLangJa,
    Json,
    Modal
) {
    $scope.modals = {
        config : {
            templateUrl : '/templates/debug/modals/config.html',
            controllerName : 'ConfigModalCtrl',
            size : 'large'
        },
        debug : {
            templateUrl : '/templates/debug/modals/debug.html',
            controllerName : 'DebugModalCtrl',
            size : 'large'
        },

    };

    $scope.openModal = function(modalName){
        Modal.open(
           $scope.modals[modalName].controllerName,
           $scope.modals[modalName].templateUrl,
           {title : modalName},
           $scope.modals[modalName].size
        );
    };

    $scope.deleteProfile = function() {
        Profile.delete().$promise.then(function(tests) {
            alert('success');
        }).catch(function(data, status) {
            alert('error');
        });
    };

    $scope.syncProfile = function() {
        SyncProfile.post().$promise.then(function(tests) {
            alert('success');
        }).catch(function(data, status) {
            alert('error');
        });
    };

    $scope.deleteLocation = function() {
        Location.delete().$promise.then(function(tests) {
            alert('success');
        }).catch(function(data, status) {
            alert('error');
        });
    };

    $scope.syncLocation = function() {
        SyncLocation.post().$promise.then(function(tests) {
            alert('success');
        }).catch(function(data, status) {
            alert('error');
        });
    };

    $scope.deleteLangJa = function() {
        LangJa.delete().$promise.then(function(tests) {
            alert('success');
        }).catch(function(data, status) {
            alert('error');
        });
    };

    $scope.syncLangJa = function() {
        SyncLangJa.post().$promise.then(function(tests) {
            alert('success');
        }).catch(function(data, status) {
            alert('error');
        });
    };

    $scope.deleteApiStorageAll = function() {
        Json.deleteStorageAll();
    };

    $scope.deleteTargetUserCondition = function() {
        Json.deleteTargetUserCondition();
    };
});
