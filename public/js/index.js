app.factory('User', function($resource) {
    return $resource('/api/users/:uid', {
        uid: '@uid'
    }, {
        get: {
            method: 'GET',
            isArray: true
        }, // apiの戻り値が配列の場合は「isArray: true」を指定する
        find: {
            method: 'GET',
            isArray: true
        },
        create: {
            method: 'POST'
        },
        update: {
            method: 'PUT',
            isArray: true
        },
        delete: {
            method: 'DELETE',
            isArray: true
        }
    });
});

app.factory('UserFind', function($resource) {
    return $resource('/api/users/find', {}, {
        find: {
            method: 'POST',
            isArray: true
        }
    });
});

function DialogController($scope, $mdDialog, locals) {

    var setUser = function() {
        $scope.targetUserCondition = {};
        angular.forEach($scope.selects, function(value, key) {
            $scope.targetUserCondition[key] = value.default;
        });
    };

    $scope.targetUserCondition = {};
    $scope.mode = locals.type;
    $scope.selects = locals.selects;
    $scope.myImage = '';

    setUser();

    $scope.selectAvatar = function(avatarNo) {
        $scope.targetUserCondition.avatarNo = avatarNo;
    };

    $scope.profiles = locals.profiles;
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

}

app.controller('ApiCtrl', function($scope, $rootScope, $mdDialog, User, UserFind, Json) {

    var _profiles;
    Json.get('/api/files/profile').then(function(profiles) {
        _profiles = profiles;
    });

    var modeTypes = {
        search: 1
    };

    var _selects = {
        name: {
            type: "text",
            default: "debug_" + Math.floor(Math.random() * (100 - 1) + 1)
        },
        age: {
            type: "number",
            default: Math.floor(Math.random() * (100 - 1) + 1)
        },
        sexType: {
            type: "number",
            default: 1
        },
        message: {
            type: "number",
            default: "I am a debug user."
        },
        date: {
            type: "date",
            default: Math.round(new Date().getTime() / 1000)
        },
        uid: {
            type: "text",
            default: "debug_" + Math.round(new Date().getTime() / 1000)
        },
        photoURL: {
            type: "text",
            default: ""
        },
        avatarNo: {
            type: "number",
            default: 1
        },
        imageUrl: {
            type: "text",
            default: false
        },
        platform: {
            type: "text",
            default: "none"
        },
        platformVersion: {
            type: "number",
            default: 1
        },
        isDebug: {
            type: "bool",
            default: true
        },
    };
    var getRandomArbitary = function(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    };

    var getUsers = function() {
        User.get().$promise.then(function(users) {
            $scope.users = users.reverse();
            console.log($scope.users);
        }).catch(function(data, status) {
            alert('error');
        });
    };
    $scope.users = User.query();
    getUsers();

    $scope.openSearch = function(ev) {
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/templates/modal/userSerch.html',
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    profiles: _profiles,
                    selects: _selects,
                    type: modeTypes.search
                }
            })
            .then(function(answer) {
                $rootScope.$broadcast('UserSearchEvent', answer);
            }, function() {
                $scope.alert = 'You cancelled the dialog.';
            });
    };

    $scope.createUser = function(userData) {
        userData = {
            uid: getRandomArbitary(1, 100),
            name: "test" + getRandomArbitary(1, 100),
            age: getRandomArbitary(1, 100),
            currentPlatform: "test",
            currentPlatformVersion: getRandomArbitary(1, 100),
            date: Math.round(new Date().getTime() / 1000),
            message: "test",
            photoURL: "test",
            photos: ["test", "test"],
            cityId: getRandomArbitary(1, 100),
            prefectureId: getRandomArbitary(1, 100),
            sexType: getRandomArbitary(1, 2)
        };
        var user = new User(userData);
        user.$create({ uid: userData.uid }).then(function(users) {
            getUsers();
            console.log($scope.users);
        }).catch(function(data, status) {
            alert('error');
        });
    };

    $scope.findUser = function(uid) {
        User.find({ uid: uid }).$promise.then(function(users) {
            $scope.users = users.reverse();
            console.log($scope.users);
        }).catch(function(data, status) {
            alert('error');
        });
    };

    $scope.searchUser = function(conditions) {
        UserFind.find(conditions).$promise.then(function(users) {
            $scope.users = users.reverse();
            console.log($scope.users);
        }).catch(function(data, status) {
            alert('error');
        });
    };
    $scope.deleteUser = function(uid) {
        User.$delete({ uid: uid }).then(function(users) {
            getUsers();
            console.log($scope.users);
        }).catch(function(data, status) {
            alert('error');
        });
    };

    $rootScope.$on('UserSearchEvent', function(event, data) {
        $scope.searchUser(data);
    });
});
