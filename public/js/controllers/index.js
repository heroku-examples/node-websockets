app.$controllerProvider.register('IndexCtrl', function ($window,
    $scope,
    $rootScope,
    $timeout,
    $localStorage,
    $mdMedia,
    $mdDialog,
    $mdBottomSheet,
    User,
    Json,
    Pager,
    Error,
    Loading,
    Modal) {


    var layoutConfig = {
        'xs': 2,
        'sm': 4,
        'md': 5,
        'lg': 10
    };

    var _profiles;
    Json.get('profile').then(function (profiles) {
        _profiles = profiles;
    });

    Json.get('location').then(function (prefectures) {
        _prefectures = prefectures;
    });

    Json.get("lang").then(function (translations) {
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
                default: 0
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

    var getRandomArbitary = function (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    };

    $scope.pager = Pager.getDefault();
    var setPager = function (result) {
        $scope.pager = Pager.get(result);
    };

    var getMediaCount = function () {
        if ($mdMedia('xs')) {
            return layoutConfig.xs;
        } else if ($mdMedia('sm')) {
            return layoutConfig.sm;
        } else if ($mdMedia('md')) {
            return layoutConfig.md;
        } else if ($mdMedia('lg')) {
            return layoutConfig.lg;
        }
    };

    var setInfiniteitems = function () {

        // In this example, we set up our model using a plain object.
        // Using a class works too. All that matters is that we implement
        // getItemAtIndex and getLength.
        $scope.infiniteItems = {
            numLoaded_: 0,
            toLoad_: 0,
            mediaCount_: getMediaCount(),

            // Required.
            getItemAtIndex: function (index) {
                if (index > this.numLoaded_) {
                    this.fetchMoreItems_(index);
                    return null;
                }
                return index;
            },

            // Required.
            // For infinite scroll behavior, we always return a slightly higher
            // number than the previously loaded items.
            getLength: function () {
                //return $scope.pager.length;
                var result = 1;
                if ($scope.pager.length >= this.mediaCount_) result = Math.floor($scope.pager.length / this.mediaCount_) + 1;
                return result;
            },
            fetchMoreItems_: function (index) {
                // For demo purposes, we simulate loading more items with a timed
                // promise. In real code, this function would likely contain an
                // $http request.

                if (this.toLoad_ < index) {
                    this.toLoad_ += this.mediaCount_;
                    this.numLoaded_ = this.toLoad_;
                }
            }
        };
    };

    var getUsers = function () {
        Loading.start();
        User.all().get().$promise.then(function (result) {
            $scope.users = result.docs.reverse();
            setPager(result);
            if (!$scope.infiniteItems) setInfiniteitems();
            Loading.finish();
        }).catch(function (data, status) {
            Loading.finish();
            Error.openMessage(data, status);
        });
    };

    var init = function () {
        Loading.start();
        if(!$window.friendRequestInfo) return;
        if(!$window.friendRequestInfo.recommendUsers) return;
        if(!$window.friendRequestInfo.recommendUsers.docs) return;
        $scope.users = $window.friendRequestInfo.recommendUsers.docs;
        setPager( $window.friendRequestInfo.recommendUsers);
        if (!$scope.infiniteItems) setInfiniteitems();
    };

    init();

    $scope.openUserInfo = function (index) {
        var templateUrl = "/templates/modal/userInfo.html?v=" + $window.deviceCacheKey;
        Modal.open('UserInfo', templateUrl, { user: $scope.users[index] })
            .then(function (answer) {

            }, function () {

            });
    };

    $scope.openSearch = function (ev) {
        var templateUrl = "/templates/modal/userSerch.html?v=" + $window.deviceCacheKey;
        Modal.open('UserSerch', templateUrl, {
            profiles: _profiles,
            selects: _selects,
            type: modeTypes.search,
            prefectures: _prefectures,
            subTitles: _subTitles
        }, 'large', 'slideLeft').then(function (answer) {
            angular.forEach(answer, function (value, key) {
                _selects[key].default = value;
            });
            $localStorage.targetUserCondition = _selects;
            $rootScope.$broadcast('UserSearchEvent', answer);
        }, function () {
            $scope.alert = 'You cancelled the dialog.';
        });
    };

    $scope.createUser = function (userData) {
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
        user.$create({ uid: userData.uid }).then(function (users) {
            getUsers();
            console.log($scope.users);
        }).catch(function (data, status) {
            Error.openMessage(data, status);
        });
    };

    $scope.findUser = function (uid) {
        User.root().find({ uid: uid }).$promise.then(function (users) {
            $scope.users = users.reverse();
            console.log($scope.users);
        }).catch(function (data, status) {
            Error.openMessage(data, status);
        });
    };

    $scope.searchUser = function (conditions) {
        Loading.start();
        User.all().find(conditions).$promise.then(function (result) {
            $scope.users = result.docs.reverse();
            setPager(result);
            Loading.finish();
        }).catch(function (data, status) {
            Loading.finish();
            console.log(data, status)
        });
    };
    $scope.deleteUser = function (uid) {
        Loading.start();
        User.current().$delete({ uid: uid }).then(function (users) {
            getUsers();
            console.log($scope.users);
        }).catch(function (data, status) {
            Error.openMessage(data, status);
            Loading.finish();
        });
    };

    $scope.getUser = function (_rangeIndex, _infiniteItemIndex) {
        return $scope.users[_rangeIndex + (_infiniteItemIndex * getMediaCount())];
    };

    $scope.getMediaCount = function () {
        return getMediaCount();
    };

    var items = [{
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
    },];

    $scope.showListBottomSheet = function ($event) {
        $mdBottomSheet.show({
            templateUrl: '/templates/bottomSheets/user.html',
            controller: 'ListBottomSheetCtrl',
            targetEvent: $event,
            locals: {
                items: items
            },
        }).then(function (clickedItem) {
            // $scope.alert = clickedItem.name + ' clicked!';
        });
    };

    $rootScope.$on('UserSearchEvent', function (event, data) {
        $scope.searchUser(data);
    });
});

app.$controllerProvider.register('ListBottomSheetCtrl', function ($scope, $mdBottomSheet, locals) {
    $scope.items = locals.items;

    $scope.listItemClick = function (item) {
        var clickedItem = item;
        $mdBottomSheet.hide(clickedItem);
    };
});
