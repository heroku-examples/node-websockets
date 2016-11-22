function ConfigModalCtrl($scope, $mdDialog, locals, Error, Login, Loading, $controller, Config, Configs) {
    $controller(ModalCtrl, { $scope: $scope, $mdDialog: $mdDialog, locals: locals, Login: Login });

    $scope.init = function () {
        Loading.start();
        Configs.get().$promise.then(function (result) {
            $scope.configs = result.docs.reverse();
            $scope.setPager(result);
            Loading.finish();
        }).catch(function (data, status) {
            Loading.finish();
            Error.openMessage(data, status);
        });
    };


    $scope.create = function () {
        Loading.start();
        Config.create().$promise.then(function (result) {
            $scope.config = result;
            Loading.finish();
        }).catch(function (data, status) {
            Loading.finish();
            Error.openMessage(data, status);
        });
    };

    $scope.update = function (debugKey, config) {
        Loading.start();
        Config.update({ name: config.name, delFlag: !config.delFlag }).$promise.then(function (result) {
            $scope.configs[debugKey].delFlag = result.result;
            $scope.debug = result;
            Loading.finish();
        }).catch(function (data, status) {
            Loading.finish();
            Error.openMessage(data, status);
            console.log(data, status);
        });
    };

    $scope.updateValue = function (debugKey, config) {
        Loading.start();
        Config.update({ name: config.name, values: { number: config.values.number + 1 } }).$promise.then(function (result) {
            $scope.configs[debugKey].delFlag = result.result;
            $scope.debug = result;
            Loading.finish();
        }).catch(function (data, status) {
            Loading.finish();
            Error.openMessage(data, status);
            console.log(data, status);
        });
    };
};

function DebugModalCtrl($scope, $mdDialog, locals, Error, Login, Loading, $controller, Jack) {
    $controller(ModalCtrl, { $scope: $scope, $mdDialog: $mdDialog, locals: locals, Login: Login });


    $scope.create = function () {
        Loading.start();
        Jack.create({ uid: 'zcMTtpFeKEhmGPiJWno0310Sv5p1' }).$promise.then(function (result) {
            $scope.debug = result;
            Loading.finish();
        }).catch(function (data, status) {
            Loading.finish();
            Error.openMessage(data, status);
        });
    };

    $scope.delete = function (debugKey, debug) {
        Loading.start();
        Debug.delete().$promise.then(function (result) {
            $scope.debugs[debugKey].delFlag = result.result;
            $scope.debug = result;
            Loading.finish();
        }).catch(function (data, status) {
            Loading.finish();
            Error.openMessage(data, status);
        });
    };
};

function JackModalCtrl($scope, $mdDialog, locals, Error, Login, Loading, $controller, Jack) {
    $controller(ModalCtrl, { $scope: $scope, $mdDialog: $mdDialog, locals: locals, Login: Login });

    $scope.targetUid = '';
    $scope.init = function () {
        Loading.start();
        Jack.get().$promise.then(function (jack) {
            $scope.jack = jack;
            Loading.finish();
        }).catch(function (data, status) {
            Loading.finish();
            Error.openMessage(data, status);
        });
    };

    $scope.set = function () {
        if (!$scope.targetUid) return;
        Loading.start();
        Jack.set({ uid: $scope.targetUid }).$promise.then(function (jack) {
            $scope.jack = jack;
            Loading.finish();
        }).catch(function (data, status) {
            Loading.finish();
            Error.openMessage(data, status);
        });
    };

    $scope.delete = function (debugKey, debug) {
        Loading.start();
        Jack.delete().$promise.then(function (result) {
            $scope.jack = jack;
            $scope.targetUid = '';
            Loading.finish();
        }).catch(function (data, status) {
            Loading.finish();
            Error.openMessage(data, status);
        });
    };
};