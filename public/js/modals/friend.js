function UserSerch($scope, $filter, $mdDialog, locals, $translate) {

    var setUser = function () {
        $scope.targetUserCondition = {};
        angular.forEach($scope.selects, function (value, key) {
            $scope.targetUserCondition[key] = value.default;
        });
        $scope.targetUserCondition['age'] = false
    };

    $scope.init = function () {
        $scope.targetUserCondition = {};
        $scope.mode = locals.type;
        $scope.selects = locals.selects;
        $scope.prefectures = locals.prefectures;
        $scope.profiles = locals.profiles;
        $scope.subTitles = locals.subTitles;
        $scope.myImage = '';
        setUser();
    };


    $scope.selectAvatar = function (avatarNo) {
        $scope.targetUserCondition.avatarNo = avatarNo;
    };

    $scope.hide = function () {

        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };
    $scope.search = function () {
        $mdDialog.hide($filter('removeEmptyInObject')($scope.targetUserCondition));
    };

    $scope.addHobbyToTargetUserCondition = function (value) {
        if (!$scope.targetUserCondition.hobbies) $scope.targetUserCondition.hobbies = [];
        if (!$filter('inArray')($scope.targetUserCondition.hobbies, value)) {
            $scope.targetUserCondition.hobbies.push(value);
        }
    };

    $scope.lowerValue = 20;
    $scope.upperValue = 100;
}

function UserInfo(
    $scope,
    $filter,
    $mdDialog,
    $controller,
    locals,
    FriendRequest,
    Loading,
    Error,
    Login
) {
    $controller(ModalCtrl, { $scope: $scope, $mdDialog: $mdDialog, locals: locals, Login: Login });
    angular.merge($scope, locals);
    var init = function () {
        Loading.start();
        FriendRequest.root().get({ targetUid: $scope.user.uid }).$promise.then(function (result) {
            console.log("msg", result)
            if (result) {
                if (!result.isApplyed && !result.isRejected && !result.isEmpty) $scope.user.requested = true;
            }

            Loading.finish();
        }).catch(function (data, status) {
            Loading.finish();
            Error.openMessage(data, status);
        });
    };
    $scope.friendRequest = function () {
        Loading.start();
        FriendRequest.root().create({ targetUid: $scope.user.uid }).$promise.then(function (result) {
            if (result) {
                if (!result.isApplyed && !result.isRejected) $scope.user.requested = true;
            }
            Loading.finish();
        }).catch(function (data, status) {
            Loading.finish();
            Error.openMessage(data, status);
        });
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    init();
}