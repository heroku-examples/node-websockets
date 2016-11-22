var app = angular.module('StarterApp', [
    'ui.router',
    'ngMaterial',
    'ngMdIcons',
    'ngResource',
    'ngMessages',
    'ngStorage',
    'ngTouch',
    'pascalprecht.translate',
    'ngCookies',
    'firebase',
    'images-resizer',
    'ngImgCrop',
    'angularLazyImg',
    'angularRangeSlider',
    'angular.filter',
    'oc.lazyLoad',
    'angular-carousel'
])
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('grey')
            .primaryPalette('grey')
            .accentPalette('grey')
            .warnPalette('grey')
            .backgroundPalette('grey').dark();
        $mdThemingProvider.theme('dark-grey')
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

    }).config(['$translateProvider', function ($translateProvider, $window) {
        var findLanguage = function () {
            return document.documentElement.lang;
        };
        $translateProvider.useStaticFilesLoader({
            prefix: '/json/lang_',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage(findLanguage());
        lang = findLanguage();
        $translateProvider.useLocalStorage();
    }]).config(function ($httpProvider) {
        $httpProvider.interceptors.push(function ($q, $rootScope) {
            return {
                request: function (config) {
                    //console.log('request: config', config);
                    return config;
                },
                requestError: function (rejection) {
                    //console.log('requestError: rejection', rejection);
                    return $q.reject(rejection);
                },
                response: function (response) {
                    if (!response.data) {
                        console.log('response: response', response);
                        response.data = { isEmpty: true };
                    }
                    return response;
                },
                responseError: function (rejection) {
                    $rootScope.$broadcast('Error', rejection);
                    console.log('responseError: rejection', rejection);
                    return $q.reject(rejection);
                }
            };
        });
    }).config(["$ocLazyLoadProvider", function ($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            debug: true,
            modules: [
                {
                    name: 'index',
                    files: ['/js/dist/app/controllers/index.' + window.deviceCacheKey + '.js']
                },
                {
                    name: 'friend',
                    files: ['/js/dist/app/services/chat.' + window.deviceCacheKey + '.js', '/js/dist/app/controllers/friend.' + window.deviceCacheKey + '.js']
                },
                {
                    name: 'setting',
                    files: ['/js/dist/app/controllers/setting.' + window.deviceCacheKey + '.js']
                },
                {
                    name: 'login',
                    files: ['/js/dist/app/controllers/login.' + window.deviceCacheKey + '.js']
                },
                {
                    name: 'userUpdate',
                    files: ['/js/dist/app/controllers/userUpdate.' + window.deviceCacheKey + '.js']
                },
                {
                    name: 'debug',
                    files: ['/js/dist/app/debug/controllers/debug.' + window.deviceCacheKey + '.js']
                },{
                    name: 'memo',
                    files: ['/js/dist/app/debug/controllers/test.' + window.deviceCacheKey + '.js']
                }, {
                    name: 'test',
                    files: ['/js/dist/app/debug/controllers/test.' + window.deviceCacheKey + '.js']
                }]
        });
    }]).config(['$provide', '$controllerProvider', '$animateProvider', '$filterProvider', '$compileProvider',
        function ($provide, $controllerProvider, $animateProvider, $filterProvider, $compileProvider) {

            // Service 系 (service, factory, value, constant) は $provide
            app.$provide = $provide;

            // あとは名前の通り
            app.$controllerProvider = $controllerProvider;
            app.$animateProvider = $animateProvider;
            app.$filterProvider = $filterProvider;
            app.compileProvider = $compileProvider;
        }])
    .run(function ($localStorage, $timeout, $window) {
        $timeout(function () {
            $window.scrollTo(0, 1);
        }, 1000);
        document.addEventListener('DOMContentLoaded', function(){
            $('#loadingContent').hide();
        }, false);
        if(!$localStorage.setting) $localStorage.setting = {};
    });