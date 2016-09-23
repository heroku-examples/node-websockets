app.directive('includeReplace', function () {
        return {
            require: 'ngInclude',
            restrict: 'A', /* optional */
            link: function (scope, el, attrs) {
                el.replaceWith(el.children());
            }
        };
    });

app.directive('ngLink', function($window) {
        return {
            restrict: 'A',
            link: function(scope, ele, attrs) {
                ele.bind('click', function(ev) {
                    $window.location.href = attrs.ngLink;
                });
            }
        };
    })
