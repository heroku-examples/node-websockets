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
      Loading.loading = true;
    });
});


app.directive('loading', function(Loading) {
    return {
        replace: true,
        template: '<md-backdrop is-loading="{{loading.isLoding}}"  flex class="md-opaque animated" style="position: fixed;z-index:1" layout="row" layout-align="center center"><div style="width: 60px;height: 60px;"><md-progress-circular class="md-warn md-hue-3" md-diameter="{{loading.speed}}"></md-progress-circular></div></md-backdrop>',
        controller: 'LoadingCtrl'
    };
});
