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
    'angular.filter',
    'oc.lazyLoad'
])
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('grey')
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
        $httpProvider.interceptors.push(function ($q) {
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
                    files: ['/js/controllers/index.js?v=' + window.deviceCacheKey]
                },
                {
                    name: 'friend',
                    files: ['/js/services/chat.js?v=' + window.deviceCacheKey, '/js/controllers/friend.js?v=' + window.deviceCacheKey]
                },
                {
                    name: 'setting',
                    files: ['/js/controllers/setting.js?v=' + window.deviceCacheKey]
                },
                {
                    name: 'login',
                    files: ['/js/controllers/login.js?v=' + window.deviceCacheKey]
                },
                {
                    name: 'userUpdate',
                    files: ['/js/controllers/userUpdate.js?v=' + window.deviceCacheKey]
                },
                {
                    name: 'debug',
                    files: ['/js/debug/controllers/debug.js?v=' + window.deviceCacheKey]
                }, {
                    name: 'test',
                    files: ['/js/debug/controllers/test.js?v=' + window.deviceCacheKey]
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
    .run(function ($localStorage) {
        if(!$localStorage.setting) $localStorage.setting = {};
    });