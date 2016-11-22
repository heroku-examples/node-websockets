app.$controllerProvider.register('TestCtrl', function ($scope, Loading, $timeout, Banner, Worker, Panel) {

    $timeout(function () {
        Panel.showDialog()

    }, 1500);

    // Worker.initialiseState();
        $scope.carousel = {index : 0}
    Banner.all.get().$promise.then(function (result) {
        $scope.banners = result.docs;
        }).catch(function (data, status) {
        });


});