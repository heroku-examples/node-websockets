app.$controllerProvider.register('TestCtrl', function ($scope, Loading, $timeout, Worker, Panel) {

    $timeout(function () {
        Panel.showDialog()

    }, 1500);

    Worker.initialiseState();
        $scope.carousel = {index : 0}
    $scope.banners = [
        { image: '/images/user.png', id: 1 },
        { image: '/images/user.png', id: 2 },
        { image: '/images/user.png', id: 3 },
        { image: '/images/user.png', id: 4 },
        { image: '/images/user.png', id: 5 },
        { image: '/images/user.png', id: 6 }
    ];

});