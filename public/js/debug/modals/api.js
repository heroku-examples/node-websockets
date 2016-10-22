function ConfigModalCtrl($scope, $mdDialog, locals, Login, Loading, $controller, Config) {
    $controller(ModalCtrl, { $scope: $scope, $mdDialog: $mdDialog, locals: locals, Login: Login });

    $scope.init = function() {
        Loading.start();
        Config.get().$promise.then(function(result) {
            $scope.configs = result.docs.reverse();
            $scope.setPager(result);
            Loading.finish();
        }).catch(function(data, status) {
            Loading.finish();
            console.log(data, status)
        });
    };


    $scope.create = function() {
        Config.create().$promise.then(function(result) {
            $scope.config = result;
            Loading.finish();
        }).catch(function(data, status) {
            Loading.finish();
            console.log(data, status)
        });
    }
}

function DebugModalCtrl($scope, $mdDialog, locals, Login, Loading, $controller, Debug) {
    $controller(ModalCtrl, { $scope: $scope, $mdDialog: $mdDialog, locals: locals, Login: Login });

    $scope.init = function() {
        Loading.start();
        Debug.get().$promise.then(function(result) {
            $scope.debugs = result.docs.reverse();
            $scope.setPager(result);
            Loading.finish();
        }).catch(function(data, status) {
            Loading.finish();
            console.log(data, status)
        });
    };

    $scope.create = function() {
        Debug.create({ uid: 'zcMTtpFeKEhmGPiJWno0310Sv5p1' }).$promise.then(function(result) {
            $scope.debug = result;
            Loading.finish();
        }).catch(function(data, status) {
            Loading.finish();
            console.log(data, status)
        });
    }
}
