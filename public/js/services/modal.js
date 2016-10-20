function ModalCtrl($scope, locals, Login) {
    $scope.locals = locals;
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
    $scope.login = function(type){
        Login.login(type);
    };
}
app.factory('Modal', function($mdDialog, $timeout) {
    var _this = {};
    _this.error = function(error, status, codeInfo) {
        $mdDialog.show({
            controller: ModalCtrl,
            templateUrl: '/templates/modal/error.html',
            targetEvent: '#bottom',
            clickOutsideToClose: true,
            locals: {
                error: error,
                status: status,
                codeInfo: codeInfo
            },
            fullscreen: true,
            onShowing: function(scope, element) {
                $timeout(function() {
                    element.find('md-dialog').addClass("center")
                }, 50)
            },
            onRemoving: function(element, removePromise) {
                $timeout(function() {
                    element.find('md-dialog').removeClass("center").addClass("slideDown")
                }, 50)
            }
        });
    };

    return _this;
});
