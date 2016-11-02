function ConfigModalCtrl($scope, $mdDialog, locals, Error, Login, Loading, $controller, Config, Configs) {
    $controller(ModalCtrl, { $scope: $scope, $mdDialog: $mdDialog, locals: locals, Login: Login });

    $scope.init = function() {
        Loading.start();
        Configs.get().$promise.then(function(result) {
            $scope.configs = result.docs.reverse();
            $scope.setPager(result);
            Loading.finish();
        }).catch(function(data, status) {
            Loading.finish();
            Error.openMessage(data, status);
        });
    };


    $scope.create = function() {
        Config.create().$promise.then(function(result) {
            $scope.config = result;
            Loading.finish();
        }).catch(function(data, status) {
            Loading.finish();
            Error.openMessage(data, status);
        });
    };

    $scope.update = function(debugKey , config) {
        Config.update({ name: config.name , delFlag : !config.delFlag}).$promise.then(function(result) {
            $scope.configs[debugKey].delFlag = result.result;
            $scope.debug = result;
            Loading.finish();
        }).catch(function(data, status) {
            Loading.finish();
            Error.openMessage(data, status);
            console.log(data, status);
        });
    };

    $scope.updateValue = function(debugKey , config) {
        Config.update({ name: config.name , values : {number :config.values.number+ 1}}).$promise.then(function(result) {
            $scope.configs[debugKey].delFlag = result.result;
            $scope.debug = result;
            Loading.finish();
        }).catch(function(data, status) {
            Loading.finish();
            Error.openMessage(data, status);
            console.log(data, status);
        });
    };
}

function DebugModalCtrl($scope, $mdDialog, locals, Error, Login, Loading, $controller, Debug, Debugs) {
    $controller(ModalCtrl, { $scope: $scope, $mdDialog: $mdDialog, locals: locals, Login: Login });

    $scope.init = function() {
        Loading.start();
        Debugs.get().$promise.then(function(result) {
            $scope.debugs = result.docs.reverse();
            $scope.setPager(result);
            Loading.finish();
        }).catch(function(data, status) {
            Loading.finish();
            Error.openMessage(data, status);
        });
    };

    $scope.create = function() {
        Debug.create({ uid: 'zcMTtpFeKEhmGPiJWno0310Sv5p1' }).$promise.then(function(result) {
            $scope.debug = result;
            Loading.finish();
        }).catch(function(data, status) {
            Loading.finish();
            Error.openMessage(data, status);
        });
    };

    $scope.update = function(debugKey , debug) {
        Debug.update({ uid: debug.uid , delFlag : !debug.delFlag}).$promise.then(function(result) {
            $scope.debugs[debugKey].delFlag = result.result;
            $scope.debug = result;
            Loading.finish();
        }).catch(function(data, status) {
            Loading.finish();
            Error.openMessage(data, status);
        });
    };
}
