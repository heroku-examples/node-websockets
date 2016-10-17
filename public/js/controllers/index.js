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

app.controller('ApiCtrl', function($window, $scope, $rootScope, $timeout, $localStorage, $mdDialog, $mdBottomSheet, User, UserFind, Json, Loading) {

    var _profiles;
    Json.get('profile').then(function(profiles) {
        _profiles = profiles;
    });

    Json.get('location').then(function(prefectures) {
        _prefectures = prefectures;
    });

    Json.get("lang").then(function(translations) {
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

    var setPager = function(result){
        $scope.pager = {
            length : result.docs.length,
            limit: result.limit,
            page: result.page,
            pages: result.pages,
            total: result.total,
        };
    };

    var getUsers = function() {
        Loading.start();
        User.get().$promise.then(function(result) {
            $scope.users = result.docs.reverse();
            setPager(result);
            Loading.finish();
            console.log($scope.users);
        }).catch(function(data, status) {
            Loading.finish();
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
            fullscreen: true
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
        Loading.start();
        UserFind.find(conditions).$promise.then(function(result) {
            $scope.users = result.docs.reverse();
            setPager(result);
            console.log($scope.users);
        }).catch(function(data, status) {
            Loading.finish();
            alert('error');
        });
    };
    $scope.deleteUser = function(uid) {
        Loading.start();
        User.$delete({ uid: uid }).then(function(users) {
            getUsers();
            console.log($scope.users);
        }).catch(function(data, status) {
            alert('error');
            Loading.finish();
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

    // In this example, we set up our model using a plain object.
    // Using a class works too. All that matters is that we implement
    // getItemAtIndex and getLength.
    $scope.infiniteItems = {
        numLoaded_: 0,
        toLoad_: 0,

        // Required.
        getItemAtIndex: function(index) {
            if (index > this.numLoaded_) {
                this.fetchMoreItems_(index);
                return null;
            }

            return index;
        },

        // Required.
        // For infinite scroll behavior, we always return a slightly higher
        // number than the previously loaded items.
        getLength: function() {
            console.log(this, $scope.users)
            //return $scope.pager.length;
            return 100;
        },

        fetchMoreItems_: function(index) {
            // For demo purposes, we simulate loading more items with a timed
            // promise. In real code, this function would likely contain an
            // $http request.

            if (this.toLoad_ < index) {
                this.toLoad_ += 25;
                $timeout(angular.noop, 300).then(angular.bind(this, function() {
                    this.numLoaded_ = this.toLoad_;
                }));
            }
        }
    };
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
