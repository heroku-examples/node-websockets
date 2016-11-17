app.$controllerProvider.register('TestCtrl', function($scope, Loading, $timeout, Worker, Panel) {

    $timeout(function(){
        Panel.showDialog()
 
    }, 1500);

    Worker.initialiseState();
});