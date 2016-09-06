app
    .factory('Loading', function() {
        var _this = {isLoding :false, speed : 60};
        return _this;
    });

app.controller('LoadingCtrl', function($scope, Loading) {
	$scope.loading = Loading;
});


app.directive('loading', function(Loading) {
    return {
        replace: true,
        template: '<md-backdrop ng-class="{ hide : !loading.isLoding,  fadeOut : !loading.isLoding, fadeIn : loading.isLoding}" flex class="md-opaque animated" tabindex="-1" style="position: fixed;z-index:1" layout="row" layout-align="center center"><md-progress-circular ng-disabled="false" class="md-warn md-hue-3" md-diameter="{{loading.speed}}"></md-progress-circular></md-backdrop>',
        controller: 'LoadingCtrl'
    };
});
