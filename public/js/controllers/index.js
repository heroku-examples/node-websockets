function UserSerchDialogController($scope, $filter, $mdDialog, locals, $translate) {

    var setUser = function() {
        $scope.targetUserCondition = {};
        angular.forEach($scope.selects, function(value, key) {
            $scope.targetUserCondition[key] = value.default;
        });
        $scope.targetUserCondition['age'] = false
    };

    $scope.init = function() {
        $scope.targetUserCondition = {};
        $scope.mode = locals.type;
        $scope.selects = locals.selects;
        $scope.prefectures = locals.prefectures;
        $scope.profiles = locals.profiles;
        $scope.subTitles = locals.subTitles;
        $scope.myImage = '';
        setUser();
    }


    $scope.selectAvatar = function(avatarNo) {
        $scope.targetUserCondition.avatarNo = avatarNo;
    };

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

    $scope.lowerValue = 20;
    $scope.upperValue = 100;
}

function UserInfoDialogController($scope, $filter, $mdDialog, locals, $translate) {
    $scope.user = locals.user;
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
}

app.controller('ApiCtrl', function($window, $scope, $rootScope, $timeout, $localStorage, $mdMedia, $mdDialog, $mdBottomSheet, User, Json, Pager, Error, Loading) {

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

    var getRandomArbitary = function(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    };

    $scope.pager = Pager.getDefault();
    var setPager = function(result) {
        $scope.pager = Pager.get(result);
    };

    var getMediaCount = function() {
        if ($mdMedia('xs')) {
            return 2;
        } else if ($mdMedia('sm')) {
            return 4;
        } else if ($mdMedia('md')) {
            return 5;
        } else if ($mdMedia('lg')) {
            return 10;
        }
    };

    var setInfiniteitems = function() {

        // In this example, we set up our model using a plain object.
        // Using a class works too. All that matters is that we implement
        // getItemAtIndex and getLength.
        $scope.infiniteItems = {
            numLoaded_: 0,
            toLoad_: 0,
            mediaCount_: getMediaCount(),

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
                //return $scope.pager.length;
                var result = 1;
                if($scope.pager.length >=  this.mediaCount_) result = Math.floor($scope.pager.length / this.mediaCount_) + 1;
                return result;
            },
            fetchMoreItems_: function(index) {
                // For demo purposes, we simulate loading more items with a timed
                // promise. In real code, this function would likely contain an
                // $http request.

                if (this.toLoad_ < index) {
                    this.toLoad_ += this.mediaCount_;
                    this.numLoaded_ = this.toLoad_;
                }
                Loading.finish();
            }
        };
    };

    var getUsers = function() {
        Loading.start();
        User.all().get().$promise.then(function(result) {
            $scope.users = result.docs.reverse();
            setPager(result);
            if(!$scope.infiniteItems) setInfiniteitems();
        }).catch(function(data, status) {
            Loading.finish();
            Error.openMessage(data, status);
        });
    };

    var init = function(){
        Loading.start();
        $scope.users = $window.users.docs.reverse();
        setPager($window.users);
        if(!$scope.infiniteItems) setInfiniteitems();
    }

    init();

    $scope.openUserInfo = function(index) {
        $scope.isModalOpen = true;
        $mdDialog.show({
            controller: UserInfoDialogController,
            templateUrl: '/templates/modal/userInfo.html?v=' + window.deviceCacheKey,
            targetEvent: '#bottom',
            clickOutsideToClose: true,
            locals: {
                user: $scope.users[index],
            },
            fullscreen: true,
            onShowing : function(scope, element){
                $timeout(function(){
                    element.find('md-dialog').addClass("center")
                }, 50)
            },
            onRemoving : function(element, removePromise){
                $timeout(function(){
                    element.find('md-dialog').removeClass("center").addClass("slideDown")
                }, 50)
            }
        })

        .then(function(answer) {
            $scope.isModalOpen = false;
        }, function() {
            $scope.isModalOpen = false;
        });
    };

    $scope.openSearch = function(ev) {
        $scope.isModalOpen = true;
        $mdDialog.show({
            controller: UserSerchDialogController,
            templateUrl: '/templates/modal/userSerch.html?v=' + window.deviceCacheKey,
            targetEvent: '#bottom',
            clickOutsideToClose: true,
            locals: {
                profiles: _profiles,
                selects: _selects,
                type: modeTypes.search,
                prefectures: _prefectures,
                subTitles: _subTitles
            },
            fullscreen: true,
            onShowing : function(scope, element){
                element.find('md-dialog').addClass("beforeSlideLeft")
                $timeout(function(){
                    element.find('md-dialog').addClass("center")
                }, 50)
            },
            onRemoving : function(element, removePromise){
                $timeout(function(){
                    element.find('md-dialog').removeClass("center").addClass("slideRight")
                }, 50)
            }
        })

        .then(function(answer) {
            $scope.isModalOpen = false;
            angular.forEach(answer, function(value, key) {
                _selects[key].default = value;
            });
            $localStorage.targetUserCondition = _selects;
            $rootScope.$broadcast('UserSearchEvent', answer);
        }, function() {
            $scope.isModalOpen = false;
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
            Error.openMessage(data, status);
        });
    };

    $scope.findUser = function(uid) {
        User.root().find({ uid: uid }).$promise.then(function(users) {
            $scope.users = users.reverse();
            console.log($scope.users);
        }).catch(function(data, status) {
            Error.openMessage(data, status);
        });
    };

    $scope.searchUser = function(conditions) {
        Loading.start();
        User.all().find(conditions).$promise.then(function(result) {
            $scope.users = result.docs.reverse();
            setPager(result);
            Loading.finish();
        }).catch(function(data, status) {
            Loading.finish();
            console.log(data, status)
        });
    };
    $scope.deleteUser = function(uid) {
        Loading.start();
        User.current().$delete({ uid: uid }).then(function(users) {
            getUsers();
            console.log($scope.users);
        }).catch(function(data, status) {
            Error.openMessage(data, status);
            Loading.finish();
        });
    };

    $scope.getMediaCount = function(){
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
    }, ];

    $scope.showListBottomSheet = function($event) {
        $mdBottomSheet.show({
            templateUrl: '/templates/bottomSheets/user.html',
            controller: 'ListBottomSheetCtrl',
            targetEvent: $event,
            locals: {
                items: items
            },
        }).then(function(clickedItem) {
            // $scope.alert = clickedItem.name + ' clicked!';
        });
    };

    $rootScope.$on('UserSearchEvent', function(event, data) {
        $scope.searchUser(data);
    });

});

app.controller('ListBottomSheetCtrl', function($scope, $mdBottomSheet, locals) {
    $scope.items = locals.items;

    $scope.listItemClick = function(item) {
        var clickedItem = item;
        $mdBottomSheet.hide(clickedItem);
    };
});
