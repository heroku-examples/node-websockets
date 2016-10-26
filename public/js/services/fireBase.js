app
    .factory('FireBaseService', function($window, $filter, $rootScope) {

        var _this = {
            app: {}
        };

        // Initialize Firebase
        var config = {
            apiKey: "AIzaSyCkVwS95pg9wxHBFFWIn00BCnwDL0ifJT8",
            authDomain: "project-3597707734440258770.firebaseapp.com",
            databaseURL: "https://project-3597707734440258770.firebaseio.com",
            storageBucket: "project-3597707734440258770.appspot.com",
        };

        var getRef = function(path) {
            return firebase.database().ref(path);
        };


        _this.app = $window.firebase.initializeApp(config);

        _this.getRef = function(path) {
            return getRef(path);
        };

        init();

        return _this;
    })
    .factory('FireBaseStorageService', function($window, $filter, $rootScope) {
    });
