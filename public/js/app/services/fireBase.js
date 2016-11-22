app
    .factory('FireBaseService', function($window, $filter, $rootScope, $firebaseObject, $firebaseArray) {

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

        var getObjectRef = function(path) {
            return $firebaseObject(firebase.database().ref(path));
        };

        var getArrayRef = function(path, childPath) {
            return $firebaseArray(firebase.database().ref(path).child(childPath));
        };

        var init = function(){
            _this.app = $window.firebase.initializeApp(config);
        };


        _this.getObjectRef = function(path) {
            return getObjectRef(path);
        };

        _this.getArrayRef = function(path, childPath) {
            return getArrayRef(path, childPath);
        };

        init();

        return _this;
    })
    .factory('FireBaseStorageService', function($window, $filter, $rootScope) {
    });
