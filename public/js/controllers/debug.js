app.factory('Profile', function($resource) {
    return $resource('/api/files/profile', {
        uid: '@uid'
    }, {
        get: {
            method: 'GET'
        },
        delete: {
            method: 'DELETE'
        }
    });
});

app.factory('SyncProfile', function($resource) {
    return $resource('/api/files/profile/sync_by_json', {
        uid: '@uid'
    }, {
        post: {
            method: 'post'
        }
    });
});

app.factory('Location', function($resource) {
    return $resource('/api/files/location', {
        uid: '@uid'
    }, {
        get: {
            method: 'GET'
        },
        delete: {
            method: 'DELETE'
        }
    });
});

app.factory('SyncLocation', function($resource) {
    return $resource('/api/files/location/sync_by_json', {
        uid: '@uid'
    }, {
        post: {
            method: 'post'
        }
    });
});

app.factory('LangJa', function($resource) {
    return $resource('/api/files/lang/ja', {
        uid: '@uid'
    }, {
        get: {
            method: 'GET'
        },
        delete: {
            method: 'DELETE'
        }
    });
});

app.factory('SyncLangJa', function($resource) {
    return $resource('/api/files/lang/ja/sync_by_json', {
        uid: '@uid'
    }, {
        post: {
            method: 'post'
        }
    });
});

app.controller('DebugCtrl', function($scope, Profile, SyncProfile, Location, SyncLocation, LangJa, SyncLangJa, Json) {

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

    $scope.deleteApiStorageAll = function(){
    	Json.deleteStorageAll();
    };

    $scope.deleteTargetUserCondition = function(){
    	Json.deleteTargetUserCondition();
    };
});
