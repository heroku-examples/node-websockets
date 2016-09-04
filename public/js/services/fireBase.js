app
    .factory('FireBaseService', function($window, $filter, $rootScope) {

        var _this = {
            user: {},
            app: {},
            objRef: {},
            arrayRef: {},
            arrayRefKeys: {}
        };

        // Initialize Firebase
        var config = {
            apiKey: "AIzaSyCkVwS95pg9wxHBFFWIn00BCnwDL0ifJT8",
            authDomain: "project-3597707734440258770.firebaseapp.com",
            databaseURL: "https://project-3597707734440258770.firebaseio.com",
            storageBucket: "project-3597707734440258770.appspot.com",
        };

        var init = function() {
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {

                    // User is signed in.
                    var isAnonymous = user.isAnonymous;
                    var uid = user.uid;

                    var _user = firebase.auth().currentUser;
                    if (_user) {
                        this.user.name = user.name;
                        this.user.email = user.email;
                        this.user.photoURL = user.photoURL;
                        this.user.uid = user.uid; // The user's ID, unique to the Firebase project. Do NOT use
                        // this value to authenticate with your backend server, if
                        // you have one. Use User.getToken() instead.
                        $rootScope.$broadcast('updated');
                    }
                } else {
                    // User is signed out.
                    // ...
                }
                // ...
            });
        };

        var setArrayRef = function(key, path, conditions) {
            _this.arrayRef[key] = firebase.database().ref(path);
            if(!conditions){
                return;
            }else{
                angular.forEach(conditions, function(condition, conditionKey) {
                   _this.arrayRef[key] = _this.arrayRef[key].orderByChild( condition.key ).equalTo( condition.value );
                });
            }
        };

        var setObjRef = function(key, path) {
            _this.objRef[key] = firebase.database().ref(path);
        };

        var getArrayRef = function(key, path) {
            return firebase.database().ref(path);
        };

        var getObjRef = function(key, path) {
            return firebase.database().ref(path);
        };

        var setValue = function(record) {
            _this.objRef[record.key] = firebase.database().ref(record.path);
            _this.objRef[record.key].set(record.value);
            //if (record.isDisconnectRemove) _this.objRef[record.key].onDisconnect().remove();
        };

        var refForObj = function(key, path) {
            if (!_this.objRef[key]) _this.objRef[key] = {};
            firebase.database().ref(path).on('value', function(data) {
                if (data.val()) {
                    _this.objRef[key].result = data.val();
                    $rootScope.$broadcast('updated');
                }
            });
        };

        var refForArray = function(key, path) {
            if (!_this.arrayRef[key]) _this.arrayRef[key] = {};
            firebase.database().ref(path).orderByChild('date').on('value', function(data) {
                if (data.val()) {
                    _this.arrayRef[key].result = data.val();
                    $rootScope.$broadcast('updated');
                }
            });
        };

        var ref = function(key, path, isArray) {
            if (!isArray) {
                refForObj(key, path);
            } else {
                refForArray(key, path);
            }
        };

        _this.app = firebase.initializeApp(config);

        _this.setValue = function(record) {
            setValue(record);
            return this;
        };

        _this.ref = function(key, path, isArray) {
            ref(key, path, isArray);
            return this;
        };

        _this.init = function() {
            init();
            return this;
        };

        _this.getArrayRef = function(key, path) {
            return getArrayRef(key, path);
        };

        _this.getObjRef = function(key, path) {
            return  getObjRef(key, path);
        };

        // conditions =  [{key : 'test', value : 1, type : 'equalTo'}]
        _this.setArrayRef = function(key, path, conditions) {
            setArrayRef(key, path, conditions);
        };

        _this.setObjRef = function(key, path) {
            setObjRef(key, path);
        };



        _this.formatFirst = function(records) {
            var result = {};
            var count = 0;
            angular.forEach(records, function(record, recordKey) {
                if (!$filter('inArray')(['$$conf', '$id', '$priority'], recordKey) && !count) {
                    result = record;
                    result.Key = recordKey;
                }
            });
            return result;
        };

        init();

        return _this;
    })
    .factory('FireBaseStorageService', function($window, $filter, $rootScope) {
        var objRef = {};
        var _this = {
            objRef: {},
            urls: {}
        };

        var init = function() {
            objRef = firebase.storage().ref();
        };

        var setObjRef = function(key, path, fileName) {
            _this.objRef[key] = objRef.child(path).child(fileName);
            return _this.objRef[key];
        };

        _this.getImageObjRef = function(fileName, key) {
            objRef.child(fileName).getDownloadURL().then(function(url) {
                _this.urls[key] = url;
                $rootScope.$broadcast('updated');
            }).catch(function(error) {
                // Handle any errors
            });
        };

        _this.setObjRef = function(key, path, fileName) {
            return setObjRef(key, path, fileName);
        };

        init();
        return _this;
    });
