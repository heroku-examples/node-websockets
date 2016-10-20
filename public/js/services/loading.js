app
    .factory('Loading', function($timeout) {
        var _this = {isLoding :true, isIniting :true, speed : 60};
        _this.start = function(){
            _this.isLoding = true;
        };
        _this.finish = function(){
            $timeout(function(){
                _this.isLoding = false;
            }, 1000);
        };
        _this.initFinish = function(){
            $timeout(function(){
                _this.isIniting = false;
            }, 1000);
        };
        return _this;
    });

app.controller('LoadingCtrl', function($scope, Loading, $element, $timeout) {
    $scope.loading = Loading;
    Loading.finish();
});


app.directive('loading', function(Loading) {
    return {
        replace: true,
        template: '<md-backdrop is-loading="{{loading.isLoding}}" ng-show="loading.isIniting || loading.isLoding" flex ng-class="{fadeOut : !loading.isLoding, animated : !loading.isLoding}" class="md-opaque" style="position: fixed;z-index:1" layout="row" layout-align="center center"><div style="width: 60px;height: 60px;"><md-progress-circular class="md-warn md-hue-3" md-diameter="{{loading.speed}}"></md-progress-circular></div></md-backdrop>',
        controller: 'LoadingCtrl'
    };
});
