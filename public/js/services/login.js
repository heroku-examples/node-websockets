app
    .factory('Login', function($window, $filter, $location, $state, $localStorage, $sessionStorage, $firebaseAuth, Error, Link, User, Token, Json) {
        var auth = $firebaseAuth();
        var _this = { isLoading: true, user: {} };

        var getCurrentUser = function(){
            User.get().$promise.then(function(_user) {
                if (_user) {
                    _this.setUserSession(_user);
                } else {
                    return;
                }
            }).catch(function(error) {
                Error.openMessage(error);
            });
        };
        var checkUserToRedirect = function() {
            if(location.pathname =="/main/redirect"){
                //_this.logOut();
            }else if (!$sessionStorage.token && (location.pathname !== "/main" && location.pathname !== "/" && location.pathname !== "")) {
                location.href = "main";
            } else {
                if(!$sessionStorage.token) return;
                User.create().$promise.then(function(_user) {
                    if (!_user) {
                        if($state.current.name !== 'signUp' ) $state.go('signUp');
                        return;
                    } else if(_user.isEntry ){
                        _this.setUserSession(_user);
                        if($state.current.name !== 'userUpdate' ) $state.go('userUpdate');
                        return;
                    }
                }).catch(function(error) {
                    Error.openMessage(error);
                });
            }
            if($filter('isEmptyObj')(_this.user)){
                getCurrentUser();
            }
        };

        auth.$onAuthStateChanged(function(firebaseUser) {
            console.log('firebaseUser', firebaseUser)
            if (firebaseUser) {
                $sessionStorage.firebaseUser = {
                    displayName: firebaseUser.displayName,
                    email: firebaseUser.email,
                    emailVerified: firebaseUser.emailVerified,
                    photoURL: firebaseUser.photoURL
                };

                var user = firebase.auth().currentUser;
                user.getToken().then(function(idToken) {
                    Token.find({ token: idToken }).$promise.then(function(_token) {
                        $sessionStorage.token = _token;
                        checkUserToRedirect();
                        //Error.openMessageByCode(299);
                    }).catch(function(error) {
                        Error.openMessage(error);
                        checkUserToRedirect();
                    });
                }).catch(function(error) {
                    Error.openMessage(error);
                    checkUserToRedirect();
                });
            } else {
                Error.openMessageByCode(401);
                checkUserToRedirect();
            }

        });


        _this.getUser = function(){
            return $sessionStorage.user;
        };

        _this.getFirebaseUser = function(){
            return $sessionStorage.firebaseUser;
        };

        _this.setUserSession = function(_user){
            $sessionStorage.user = _user;
        };

        _this.login = function(type) {
            _this.isLoading = true;
            if (type != 'google') {
                auth.$signInWithEmailAndPassword($localStorage.user.email, $localStorage.user.password).then(function(firebaseUser) {
                    console.log("Signed in as:", firebaseUser.uid);
                }).catch(function(error) {
                    console.error("Authentication failed:", error);
                });
            } else if (type == 'google') {
                auth.$signInWithRedirect(type).then(function() {
                    // Never called because of page redirect
                }).catch(function(error) {
                    console.error("Authentication failed:", error);
                });
            } else {
                auth.$signInWithRedirect(type).then(function() {
                    // Never called because of page redirect
                }).catch(function(error) {
                    console.error("Authentication failed:", error);
                });
            }
        };
        _this.logOut = function() {
            Token.delete().$promise.then(function(_token) {
                auth.$signOut();
                $sessionStorage.token = false;
                $sessionStorage.firebaseUser = false;
            }).catch(function(error) {
                Error.openMessage(error);
            });
        };
        _this.getAuth = function() {
            return auth.$getAuth();
        };
        _this.checkUserToRedirect = function() {
            checkUserToRedirect();
        };
        _this.checkUser = function() {
            if (!$sessionStorage.user) {
                return false;
            } else if (!$sessionStorage.user.isLogedIn) {
                return false;
            }
            return true;
        };
        return _this;
    });

// $sessionStorage.user = {
//     displayName: firebaseUser.displayName,
//     email: firebaseUser.email,
//     emailVerified: firebaseUser.emailVerified,
//     isAnonymous: firebaseUser.isAnonymous,
//     isLogedIn: true,
// };
// if(!$localStorage.user) $localStorage.user = {};
// $localStorage.user.displayName = firebaseUser.displayName,
// $localStorage.user.email = firebaseUser.email,
// $localStorage.user.uid = firebaseUser.uid,
// $localStorage.user.isCordovaApp = $window.isCordovaApp;

// _this.user = User.getCurrent();
// _this.user.$loaded().then(function(user) {
//     if (_this.user.uid !== $localStorage.user.uid) {
//         Loading.start();
//         _this.user.name = $localStorage.user.displayName;
//         _this.user.age = 0;
//         //1:men, 2 :women, 3   = other
//         _this.user.sexType = 1;
//         _this.user.message = 'よろしくね';
//         _this.user.date = Math.round(new Date().getTime() / 1000);
//         _this.user.uid = $localStorage.user.uid;
//         _this.user.photoURL = $sessionStorage.user.photoURL;
//         _this.user.imageUrl = null;
//         _this.user.platform = ionic.Platform.platform();
//         _this.user.platformVersion = ionic.Platform.version();
//         _this.selectedPhoto = $sessionStorage.user.photoURL;
//         _this.user.$save().then(function(ref) {
//             Loading.finish();
//         });
//     }
//     if (typeof user == 'object') {
//         $sessionStorage.user.photoURL = _this.user.photoURL;
//         $localStorage.user.name = _this.user.name;
//     }
//     _this.isLoading = false;
// });
