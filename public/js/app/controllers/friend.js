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
            length: $window.friendRequestInfo.requestInfos.length,
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
        friends: { key: 'friendUids' },
        requests: { key: 'receivedUids' },
        sendUids: { key: 'sendUids' },
        rejects: { key: 'rejectedUids' }
    }

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
            
            Loading.finish();
        }).catch(function (data, status) {
            Loading.finish();

            Error.openMessage(data, status);
        });
    };

    var init = function () {
        $scope.result = $window.friendRequestInfo;
        //if (!$scope.infiniteItems) setInfiniteitems();
    };

    $scope.getRequest = function (uid) {
        var result = $window.friendRequestInfo.requestInfos[uid];
        return result ? result.friend_request : false;
    };

    $scope.getFriend = function (uid) {
        var result = $window.friendRequestInfo.userInfos[uid];
        return result ? result.friend : false;
    };

    $scope.notifies = {};
    $scope.setNotify = function (uid) {
        if (!$window.friendRequestInfo.requestInfos[uid]) return;
        if ($scope.notifies[uid]) return;
        $scope.notifies[uid] = FireBaseService.getObjectRef('/private_chats/' + $window.friendRequestInfo.requestInfos[uid].friend_request.url + '/unread/' + currentUser.uid);
        $scope.notifies[uid].$loaded(
            function (data) {
                console.log(data); // true
            },
            function (error) {
                console.error("Error:", error);
            }
        );
    };

    $scope.getFriendInfo = function (uid) {
        var result = $window.friendRequestInfo.requestInfos[uid];
        return result ? result : false;
    };

    $scope.applyRequest = function (fromUid) {
        Loading.start();
        FriendRequest.apply().update({ fromUid: fromUid }).$promise.then(function (result) {
            getRequests();
            Toast.show($window.friendRequestInfo.userInfos[fromUid].firstName + "からのリクエストを承認しました。");
        }).catch(function (data, status) {
            Loading.finish();
            Error.openMessage(data, status);
        });
    };

    $scope.openChat = function (uid) {
        var friend_request = $window.friendRequestInfo.requestInfos[uid]
        if(!friend_request.isApplyed) return;
        var friend = $window.friendRequestInfo.userInfos[uid]
        Modal.open('ChatCtrl', "/templates/modal/chat.html?v=" + window.deviceCacheKey, {friend_request : friend_request, friend : friend});
    };

    $scope.openUserInfo = function (uid) {
        var templateUrl = "/templates/modal/userInfo.html?v=" + $window.deviceCacheKey;
        Modal.open('UserInfo', templateUrl, { user: $window.friendRequestInfo.userInfos[uid] })
            .then(function (answer) {

            }, function () {

            });
    };

    $scope.getMediaCount = function () {
        return getMediaCount();s
    };

    $scope.tabSelectedIndex = 0;
    $scope.clickIcon === 'thumb_up'

    $scope.clickIconMorph = function () {
        if ($scope.clickIcon === 'thumb_up') {
            $scope.clickIcon = 'thumb_down';
        }
        else {
            $scope.clickIcon = 'thumb_up';
        }
    };
    init();


});
