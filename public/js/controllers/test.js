app.controller('TestCtrl', function($scope, Loading,$timeout) {
    Loading.isLoding = true;
    $timeout(function(){
        Loading.isLoding = false;
    }, 1500);
});
