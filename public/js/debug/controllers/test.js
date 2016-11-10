app.$controllerProvider.register('TestCtrl', function($scope, Loading, $timeout, Worker) {
    Loading.start();
    $timeout(function(){
        Loading.finish();
    }, 1500);

    Worker.initialiseState();
});