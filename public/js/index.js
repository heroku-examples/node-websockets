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

function DialogController($scope, $filter, $mdDialog, locals, $translate) {

    var setUser = function() {
        $scope.targetUserCondition = {};
        angular.forEach($scope.selects, function(value, key) {
            $scope.targetUserCondition[key] = value.default;
        });
    };

    $scope.targetUserCondition = {};
    $scope.mode = locals.type;
    $scope.selects = locals.selects;
    $scope.prefectures = locals.prefectures;
    $scope.subTitles = locals.subTitles;
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
        $mdDialog.hide($filter('removeEmptyInObject')($scope.targetUserCondition));
    };

}

app.controller('ApiCtrl', function($window, $scope, $rootScope, $localStorage, $mdDialog, User, UserFind, Json) {

    var _profiles;
    Json.get('/api/files/profile').then(function(profiles) {
        _profiles = profiles;
    });

    Json.get('/api/files/location').then(function(prefectures) {
        _prefectures = prefectures;
    });

    Json.get("/json/lang_" + $window.lang + ".json").then(function(translations) {
        _subTitles = translations.subTitle;
    });

    var modeTypes = {
        search: 1
    };

var _selects;
    if($localStorage.targetUserCondition){
        _selects = $localStorage.targetUserCondition;
    }else{
        _selects = {
            age: {
                type: "number",
                default: Math.floor(Math.random() * (100 - 1) + 1)
            },
            sexType: {
                type: "number",
                default: null
            },
            cityId: {
                type: "number",
                default: null,
                isHide:true
            },
            prefectureId: {
                type: "number",
                default: null,
                isHide:true
            },
        };
    }

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
                    type: modeTypes.search,
                    prefectures : _prefectures,
                    subTitles : _subTitles
                }
            })
            .then(function(answer) {
                angular.forEach(answer,  function(value, key) {
                    _selects[key].default = value;
                });
                $localStorage.targetUserCondition = _selects;
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
