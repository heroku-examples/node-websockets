function ModalCtrl($scope, $mdDialog, Loading, locals, Login) {
    $scope.locals = locals;
    $scope.setPager = function(result) {
        $scope.pager = {
            length: result.docs.length,
            limit: result.limit,
            page: result.page,
            pages: result.pages,
            total: result.total,
        };
    };
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
app.factory('Modal', function($window, $mdDialog, $timeout) {
    var _this = {
        templates: {
            errorTemplateUrl: '/templates/modal/error.html',
            defaultTemplateUrl: '/templates/modal/default.html'
        },
        sizes: {
            large: {
                onShowing: function(scope, element) {
                    $timeout(function() {
                        element.find('md-dialog').addClass("center");
                    }, 50);
                },
                onRemoving: function(element, removePromise) {
                    $timeout(function() {
                        element.find('md-dialog').removeClass("center").addClass("slideDown");
                    }, 50);
                },
                fullscreen: true
            },
            medium :{
                onShowing: angular.noop(),
                onRemoving: angular.noop(),
                fullscreen: false
            },
            small: {
                onShowing: angular.noop(),
                onRemoving: angular.noop(),
                fullscreen: false
            }
        }
    };

    _this.getTemplateFunc = function(size) {
        var func = _this.sizes.large;
        switch (size) {
            case 'small':
                func = _this.sizes.small;
                break;
            case 'medium':
                func = _this.sizes.medium;
                break;
            case 'large':
                break;
            default:
                break;
        }
        return func;
    };
    _this.open = function(controllerName, templateUrl, locals, size) {
        var template = _this.getTemplateFunc(size);
        $mdDialog.show({
            controller: $window[controllerName],
            templateUrl: templateUrl ? templateUrl : _this.templates.defaultTemplateUrl,
            clickOutsideToClose: true,
            locals: locals,
            fullscreen: template.fullscreen,
            onShowing: template.onShowing,
            onRemoving: template.onRemoving
        });
    };
    _this.error = function(error, status, codeInfo, templateUrl) {
        var template = _this.getTemplateFunc(size);
        $mdDialog.show({
            controller: ModalCtrl,
            templateUrl: templateUrl ? templateUrl : _this.errorTemplateUrl,
            clickOutsideToClose: true,
            locals: {
                error: error,
                status: status,
                codeInfo: codeInfo
            },
            onShowing: template.onShowing,
            onRemoving: template.onRemoving
        });
    };

    return _this;
});
