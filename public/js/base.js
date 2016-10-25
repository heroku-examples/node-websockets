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
        $mdThemingProvider.theme( 'grey')
            .primaryPalette('grey')
            .accentPalette('grey')
            .warnPalette('grey')
            .backgroundPalette('grey').dark();
        $mdThemingProvider.theme('default')
            .primaryPalette('orange')
            .accentPalette('orange')
            .warnPalette('orange')
            .backgroundPalette('orange');
        $mdThemingProvider.theme('purple')
            .primaryPalette('purple')
            .accentPalette('purple')
            .warnPalette('purple')
            .backgroundPalette('indigo').dark();
        $mdThemingProvider.theme('blue')
            .primaryPalette('blue')
            .accentPalette('blue')
            .warnPalette('blue')
            .backgroundPalette('blue').dark();

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
    }]).config(function($httpProvider) {
        $httpProvider.interceptors.push(function($q) {
            return {
                request: function(config) {
                    //console.log('request: config', config);
                    return config;
                },
                requestError: function(rejection) {
                    //console.log('requestError: rejection', rejection);
                    return $q.reject(rejection);
                },
                response: function(response) {
                    console.log('response: response', response);
                    if(!response.data){
                        response.data = {isEmpty : true};
                    }
                    return response;
                },
                responseError: function(rejection) {
                    console.log('responseError: rejection', rejection);
                    return $q.reject(rejection);
                }
            };
        });
    })
