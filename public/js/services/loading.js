app
    .factory('Loading', function() {
        var _this = {isLoding :true, speed : 60};
        return _this;
    });

app.controller('LoadingCtrl', function($scope, Loading, $element, $timeout) {
    $element.hide();
	$scope.loading = Loading;
    $scope.$watch('loading.isLoding', function(newVal, oldVal) {

      if(newVal = false){
        $timeout(function(){
            $(".loadingFadeOut").fadeOut();
        },500)
      }else{
        $(".loadingFadeOut").show();
      }
    });
});


app.directive('loading', function(Loading) {
    return {
        replace: true,
        template: '<md-backdrop is-loading="{{loading.isLoding}}" ng-class="{ loadingFadeOut : !loading.isLoding, loadingFadeIn : loading.isLoding}" flex class="md-opaque animated" tabindex="-1" style="position: fixed;z-index:1" layout="row" layout-align="center center"><md-progress-circular ng-disabled="false" class="md-warn md-hue-3" md-diameter="{{loading.speed}}"></md-progress-circular></md-backdrop>',
        controller: 'LoadingCtrl'
    };
});
