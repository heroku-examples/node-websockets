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
    console.log($scope.profiles, $scope.subTitles)
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

    $scope.addHobbyToTargetUserCondition = function(value) {
        if (!$scope.targetUserCondition.hobbies) $scope.targetUserCondition.hobbies = [];
        if (!$filter('inArray')($scope.targetUserCondition.hobbies, value)) {
            $scope.targetUserCondition.hobbies.push(value);
        }
    };
}

app.controller('ApiCtrl', function($window, $scope, $rootScope, $localStorage, $mdDialog, $mdBottomSheet, User, UserFind, Json, Loading) {

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
    if ($localStorage.targetUserCondition) {
        _selects = $localStorage.targetUserCondition;
    } else {
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
                isHide: true
            },
            prefectureId: {
                type: "number",
                default: null,
                isHide: true
            },
        };
    }

    var getRandomArbitary = function(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    };

    var getUsers = function() {
        Loading.isLoding = true;
        User.get().$promise.then(function(users) {
            $scope.users = users.reverse();
            Loading.isLoding = false;
            console.log($scope.users);
        }).catch(function(data, status) {
            Loading.isLoding = false;
            alert('error');
        });
    };
    $scope.users = User.query();
    getUsers();

    $scope.openSearch = function(ev) {
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/templates/modal/userSerch.html',
                targetEvent: '#bottom',
                clickOutsideToClose: true,
                locals: {
                    profiles: _profiles,
                    selects: _selects,
                    type: modeTypes.search,
                    prefectures: _prefectures,
                    subTitles: _subTitles
                },
                fullscreen : true
            })

            .then(function(answer) {
                angular.forEach(answer, function(value, key) {
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
        Loading.isLoding = true;
        UserFind.find(conditions).$promise.then(function(users) {
            $scope.users = users.reverse();
            Loading.isLoding = false;
            console.log($scope.users);
        }).catch(function(data, status) {
            Loading.isLoding = false;
            alert('error');
        });
    };
    $scope.deleteUser = function(uid) {
        Loading.isLoding = true;
        User.$delete({ uid: uid }).then(function(users) {
            getUsers();
            console.log($scope.users);
        }).catch(function(data, status) {
            alert('error');
            Loading.isLoding = false;
        });
    };

    $scope.showListBottomSheet = function($event) {
        $scope.alert = '';
        $mdBottomSheet.show({
            templateUrl: '/templates/bottomSheets/user.html',
            controller: 'ListBottomSheetCtrl',
            targetEvent: $event
        }).then(function(clickedItem) {
            $scope.alert = clickedItem.name + ' clicked!';
        });
    };

    $rootScope.$on('UserSearchEvent', function(event, data) {
        $scope.searchUser(data);
    });
});

app.controller('ListBottomSheetCtrl', function($scope, $mdBottomSheet) {
    $scope.items = [{
        name: 'Share',
        icon: 'share'
    }, {
        name: 'Upload',
        icon: 'upload'
    }, {
        name: 'Copy',
        icon: 'copy'
    }, {
        name: 'Print this page',
        icon: 'print'
    }, ];

    $scope.listItemClick = function($index) {
        var clickedItem = $scope.items[$index];
        $mdBottomSheet.hide(clickedItem);
    };
});