app.controller('FriendCtrl', function($scope, $filter, $sessionStorage, Json, Loading, Toast, Login, File, FriendRequest, Error) {
    var setPager = function(result) {
        $scope.pager = {
            length: result.docs.length,
            limit: result.limit,
            page: result.page,
            pages: result.pages,
            total: result.total,
        };
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
                if ($scope.pager.length >= this.mediaCount_) result = Math.floor($scope.pager.length / this.mediaCount_) + 1;
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

    var getRequests = function() {
        Loading.start();
        FriendRequest.root.get().$promise.then(function(result) {
            $scope.requests = result.docs.reverse();
            setPager(result);
            if (!$scope.infiniteItems) setInfiniteitems();
        }).catch(function(data, status) {
            Loading.finish();
            Error.openMessage(data, status);
        });
    };

    var init = function() {
        Loading.start();
        getRequests();
        if (!$scope.infiniteItems) setInfiniteitems();
    }

    init();
});
