function ChatCtrl($scope,
    $mdDialog,
    locals,
    Error,
    Login,
    Chat,
    Loading,
    $controller,
    $mdMedia,
    Pager,
    Toast,
    Vibration,
    FriendRequest,
    FireBaseService) {
    $controller(ModalCtrl, { $scope: $scope, $mdDialog: $mdDialog, locals: locals, Login: Login });
    angular.merge($scope, locals);
    $scope.pager = Pager.getDefault();

    $scope.currentUser = Login.getUser();

    var setPager = function (result) {
        $scope.pager = Pager.get(result);
    };

    var layoutConfig = {
        'xs': 1,
        'sm': 1,
        'md': 2,
        'lg': 4
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
            $scope.requests = result.docs;
            setPager(result);
            if (!$scope.infiniteItems) setInfiniteitems();
            Loading.finish();
        }).catch(function (data, status) {
            Loading.finish();
            Error.openMessage(data, status);
        });
    };

    var readMessage = function () {
        Chat.root().read(
            {
                url: locals.friend_request.url
            }
        ).$promise.then(function (result) {
            //nothing todo
        }).catch(function (data, status) {
            Error.openMessage(data, status);
        });
    };


    
    var setFireBase = function () {
        var isLoaded = false;
        $scope.friendChat = FireBaseService.getObjectRef('/private_chats/' + locals.friend_request.url);
        $scope.messages = FireBaseService.getArrayRef('/private_chats/' + locals.friend_request.url, '/comments');
        $scope.messages.$loaded(
            function (x) {
                console.log(x)
                readMessage();
                isLoaded = true;
            }, function (error) {
                Error.openMessage(error, 401);
            });
        $scope.messages.$watch(function (event) {
            if (isLoaded && $scope.messages[$scope.messages.length - 1].uid != $scope.currentUser.uid) {
                Vibration.play();
            }
        });

    };



    $scope.init = function () {
        setFireBase();
        Loading.start();
        getRequests();
        readMessage();
        if (!$scope.infiniteItems) setInfiniteitems();
    };

    $scope.getChat = function (_rangeIndex, _infiniteItemIndex) {
        //return $scope.users[_rangeIndex + (_infiniteItemIndex * getMediaCount())];
    };

    $scope.applyRequest = function (friendInfo) {
        Loading.start();
        FriendRequest.apply().update({ fromUid: friendInfo.friend_request.fromUid }).$promise.then(function (result) {
            getRequests();
            Toast.show(friendInfo.friend.firstName + "からのリクエストを承認しました。");
        }).catch(function (data, status) {
            Loading.finish();
            Error.openMessage(data, status);
        });
    };

    $scope.getMediaCount = function () {
        return getMediaCount();
    };

    $scope.sendMessage = function () {
        if (!$scope.comment) return;
        Chat.root().send(
            {
                url: locals.friend_request.url,
                text: $scope.comment,
                photoURL: Login.getUser().photoURL,
                targetUid: locals.friend.uid
            }
        ).$promise.then(function (result) {
            Loading.finish();
            $scope.comment = "";
        }).catch(function (data, status) {
            Loading.finish();
            Error.openMessage(data, status);
        });
    };



    $scope.gotoBottom = function () {
        document.getElementById('slide-up-dialog-content').scrollTop = 10000000;
    };
}
