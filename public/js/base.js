var app = angular.module('StarterApp', [
        'ui.router',
        'ngMaterial',
        'ngMdIcons',
        'ngResource',
        'ngMessages',
        'ngStorage',
        'pascalprecht.translate',
        'ngCookies',
        'firebase',
        'images-resizer',
        'ngImgCrop',
        'angularLazyImg',
        'angularRangeSlider',
        'angular.filter'
    ])
    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('yellow')
            .accentPalette('blue');

        // Define a theme for the Login dialogs;
        // @see <md-dialog md-theme="login">...</md-dialog>

        $mdThemingProvider.theme('login')
            .primaryPalette('brown')
            .accentPalette('yellow');
    }).config(['$translateProvider', function($translateProvider, $window) {
        var findLanguage = function() {
            return document.documentElement.lang;
        };
        $translateProvider.useStaticFilesLoader({
            prefix: '/json/lang_',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage(findLanguage());
        lang = findLanguage();
        $translateProvider.useLocalStorage();
    }]);
