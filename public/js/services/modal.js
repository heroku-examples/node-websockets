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
            errorTemplateUrl: '/templates/modal/error.html?v=' + window.deviceCacheKey,
            defaultTemplateUrl: '/templates/modal/default.html?v=' + window.deviceCacheKey,
        },
        sizes: {
            large: {
                targetEvent : '#bottom',
                fullscreen: true
            },
            medium :{
                targetEvent : '',
                onShowing: angular.noop(),
                onRemoving: angular.noop(),
                fullscreen: false
            },
            small: {
                targetEvent : '',
                onShowing: angular.noop(),
                onRemoving: angular.noop(),
                fullscreen: false
            }
        },
        animations :{
            slideUp : {
                onShowing: function(scope, element) {
                    $timeout(function() {
                        element.find('md-dialog').addClass("center");
                    }, 50);
                },
                onRemoving: function(element, removePromise) {
                    $timeout(function() {
                        element.find('md-dialog').removeClass("center").addClass("slideUp");
                    }, 50);
                },
            },
            slideDown : {
                onShowing: function (scope, element) {
                    $timeout(function () {
                        element.find('md-dialog').addClass("center")
                    }, 50)
                },
                onRemoving: function (element, removePromise) {
                    $timeout(function () {
                        element.find('md-dialog').removeClass("center").addClass("slideDown")
                    }, 50)
                }
            },
            slideLeft : {
                onShowing: function (scope, element) {
                    element.find('md-dialog').addClass("beforeSlideLeft")
                    $timeout(function () {
                        element.find('md-dialog').addClass("center")
                    }, 50)
                },
                onRemoving: function (element, removePromise) {
                    $timeout(function () {
                        element.find('md-dialog').removeClass("center").addClass("slideRight")
                    }, 50)
                }
            },
            slideRight : {
                onShowing: function (scope, element) {
                    element.find('md-dialog').addClass("beforeSlideRight")
                    $timeout(function () {
                        element.find('md-dialog').addClass("center")
                    }, 50)
                },
                onRemoving: function (element, removePromise) {
                    $timeout(function () {
                        element.find('md-dialog').removeClass("center").addClass("slideLeft")
                    }, 50)
                }
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

    _this.getAnimation = function(animationType) {
        var animation = _this.animations.slideDown;
        switch (animationType) {
            case 'slideUp':
                animation = _this.animations.slideUp;
                break;
            case 'slideDown':
                animation = _this.animations.slideDown;
                break;
            case 'slideLeft':
                animation = _this.animations.slideLeft;
                break;
            case 'slideRight':
                animation = _this.animations.slideRight;
                break;
            default:
                break;
        }
        return animation;
    };
    _this.open = function(controllerName, templateUrl, locals, size, animationName) {
        var template = _this.getTemplateFunc(size);
        var animation = _this.getTemplateFunc(animationName);
        return $mdDialog.show({
            controller: $window[controllerName],
            targetEvent: template.targetEvent,
            clickOutsideToClose: true,
            templateUrl: templateUrl ? templateUrl : _this.templates.defaultTemplateUrl,
            locals: locals,
            fullscreen: template.fullscreen,
            onShowing: animation.onShowing,
            onRemoving: animation.onRemoving
        });
    };
    _this.error = function(error, status, codeInfo, templateUrl, isUnauthorized) {
        var template = _this.getTemplateFunc('large');
        var animation = _this.getTemplateFunc('slideUp');
        return $mdDialog.show({
            controller: ModalCtrl,
            targetEvent: template.targetEvent,
            templateUrl: templateUrl ? templateUrl : _this.templates.errorTemplateUrl,
            clickOutsideToClose: true,
            locals: {
                error: error,
                status: status,
                codeInfo: codeInfo,
                isUnauthorized : isUnauthorized
            },
            onShowing: animation.onShowing,
            onRemoving: animation.onRemoving
        });
    };

    return _this;
});
