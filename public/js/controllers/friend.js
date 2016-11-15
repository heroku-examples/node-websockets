app.$controllerProvider.register('FriendCtrl', function ($window,
    $scope,
    $rootScope,
    $timeout,
    $localStorage,
    $mdMedia,
    $mdDialog,
    $mdBottomSheet,
    Toast,
    User,
    Json,
    Error,
    Pager,
    Login,
    Loading,
    FriendRequest,
    FireBaseService,
    Modal) {
    $scope.pager = Pager.getDefault();
    var setPager = function (result) {
        $scope.pager = {
            length: $scope.requests.length,
            limit: result.limit,
            page: result.page,
            pages: result.pages,
            total: result.total
        };
    };

    var currentUser = Login.getUser();

    var layoutConfig = {
        'xs': 1,
        'sm': 1,
        'md': 2,
        'lg': 4
    };

    var tabTypes = {
        friends: { key: 'sendList' },
        requests: { key: 'requests' },
        rejects: { key: 'requests' }
    }

    var setInfiniteitems = function () {

        $scope.infiniteItemList = {};
        angular.forEach(tabTypes, function (type,typeKey) {
            $scope.infiniteItemList[typeKey] = {
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
                    //return result.docs[].length;
                    var result = 1;
                    if ($scope.result[type.key].length >= this.mediaCount_) result = Math.floor($scope.result[type.key].length / this.mediaCount_) + 1;
                    if ($scope.result[type.key].length < this.mediaCount_) result = $scope.result[type.key].length;
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
        });

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
                if ($scope.pager.length < this.mediaCount_) result = $scope.pager.length;
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

    var getRequests = function () {
        Loading.start();
        FriendRequest.all().get().$promise.then(function (result) {
            $scope.requests = [];
            $scope.result = false;
            if (result.docs) {
                $scope.result = result.docs;
                angular.forEach(result.docs.allList, function (request, key) {
                    var uid = '';
                    if (request.uid == currentUser.uid) {
                        uid = request.fromUid;
                    } else {
                        uid = request.uid;
                    }
                    $scope.requests.push({
                        friend_request: request,
                        friend: result.docs.userInfos[uid]
                    });
                });
                setPager(result);
                if (!$scope.infiniteItems) setInfiniteitems();
            } else {
                angular.forEach($window.userInfos, function (userInfo, key) {
                    $scope.requests.push({
                        friend_request: {},
                        friend: userInfo
                    });
                });
                $scope.pager = {
                    length: Object.keys($window.userInfos).length,
                    limit: 100,
                    page: 1,
                    pages: 1,
                    total: Object.keys($window.userInfos).length
                };
            }
            Loading.finish();
        }).catch(function (data, status) {
            Loading.finish();

            Error.openMessage(data, status);
        });
    };

    var init = function () {
        Loading.start();
        getRequests();
        if (!$scope.infiniteItems) setInfiniteitems();
    };

    $scope.getRequest = function (_rangeIndex, _infiniteItemIndex) {
        var result = $scope.requests[_rangeIndex + (_infiniteItemIndex * getMediaCount())];
        return result ? result.friend_request : false;
    };

    $scope.getFriend = function (_rangeIndex, _infiniteItemIndex) {
        var result = $scope.requests[_rangeIndex + (_infiniteItemIndex * getMediaCount())];
        return result ? result.friend : false;
    };

    $scope.getIndex = function (_rangeIndex, _infiniteItemIndex) {
        var index = _rangeIndex + (_infiniteItemIndex * getMediaCount());
        return index;
    }

    $scope.notifies = [];
    $scope.setNotify = function (_rangeIndex, _infiniteItemIndex) {
        var index = _rangeIndex + (_infiniteItemIndex * getMediaCount());
        if (!$scope.requests[index]) return;
        if ($scope.notifies[index]) return;
        $scope.notifies[index] = FireBaseService.getObjectRef('/private_chats/' + $scope.requests[index].friend_request.url + '/unread/' + currentUser.uid);
        $scope.notifies[index].$loaded(
            function (data) {
                console.log(data); // true
            },
            function (error) {
                console.error("Error:", error);
            }
        );
    };

    $scope.getFriendInfo = function (_rangeIndex, _infiniteItemIndex) {
        var result = $scope.requests[_rangeIndex + (_infiniteItemIndex * getMediaCount())];
        return result ? result : false;
    };

    $scope.applyRequest = function (friendInfo) {
        Loading.start();
        FriendRequest.apply().update({ fromUid: friendInfo.fromUid }).$promise.then(function (result) {
            getRequests();
            Toast.show(friendInfo.firstName + "からのリクエストを承認しました。");
        }).catch(function (data, status) {
            Loading.finish();
            Error.openMessage(data, status);
        });
    };

    $scope.openChat = function (friendInfo) {
        Modal.open('ChatCtrl', "/templates/modal/chat.html?v=" + window.deviceCacheKey, friendInfo);
    };

    $scope.openUserInfo = function (friendInfo) {
        var templateUrl = "/templates/modal/userInfo.html?v=" + $window.deviceCacheKey;
        Modal.open('UserInfo', templateUrl, { user: friendInfo })
            .then(function (answer) {

            }, function () {

            });
    };

    $scope.getMediaCount = function () {
        return getMediaCount();
    };
    init();
});
