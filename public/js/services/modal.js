function ModalCtrl($scope, $mdDialog, locals, Login) {
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
    $scope.login = function(type) {
        Login.login(type);
    };
}
app.factory('Modal', function($mdDialog, $timeout) {
    var _this = {
        errorTemplateUrl: '/templates/modal/error.html'
    };
    _this.error = function(error, status, codeInfo, templateUrl) {

        $mdDialog.show({
            controller: ModalCtrl,
            templateUrl: templateUrl ? templateUrl : _this.errorTemplateUrl,
            targetEvent: '#bottom',
            clickOutsideToClose: true,
            locals: {
                error: error,
                status: status,
                codeInfo: codeInfo
            },
            onShowing: function(scope, element) {
                $timeout(function() {
                    element.find('md-dialog').addClass("center")
                }, 50);
            },
            onRemoving: function(element, removePromise) {
                $timeout(function() {
                    element.find('md-dialog').removeClass("center").addClass("slideDown")
                }, 50);
            }
        });
    };

    return _this;
});
