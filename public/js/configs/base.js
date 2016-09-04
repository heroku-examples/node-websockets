app.config(function($mdThemingProvider) {
    var customBlueMap = $mdThemingProvider.extendPalette('light-blue', {
        'contrastDefaultColor': 'light',
        'contrastDarkColors': ['50'],
        '50': 'ffffff'
    });
    $mdThemingProvider.definePalette('customBlue', customBlueMap);
    $mdThemingProvider.theme('default')
        .primaryPalette('customBlue', {
            'default': '500',
            'hue-1': '50'
        })
        .accentPalette('pink');
    $mdThemingProvider.theme('input', 'default')
        .primaryPalette('grey');
});

app.config(['$translateProvider', function($translateProvider, $window) {

        var findLanguage = function() {
             return "ja";
            // try {
            //     return (navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0, 2);
            // } catch (e) {
            //     return "ja";
            // }
        };
        $translateProvider.useStaticFilesLoader({
            prefix: '/json/lang_',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage(findLanguage());
        lang = findLanguage();
        $translateProvider.useLocalStorage();
    }]);
