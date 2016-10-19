function ModalCtrl($scope, locals) {
    $scope.locals = locals;
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
