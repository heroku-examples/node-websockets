app.factory('Token', function($resource) {
    return $resource('/api/token/check', {}, {
        find: {
            method: 'POST',
            isArray: false
        },
        update: {
            method: 'PUT',
            isArray: true
        },
    });
});

app
    .factory('Login', function($window, $location, $state, $localStorage, $sessionStorage, $firebaseAuth, Error, Link, User, Token, Json) {
        var auth = $firebaseAuth();
        var _this = { isLoading: true, user: {} };

        var checkUserToRedirect = function() {
            if (!$sessionStorage.token && (location.pathname != "/main" && location.pathname != "/" && location.pathname != "")) {
                location.href = "main";
            } else {
                if(!$sessionStorage.token) return;
                User.create().$promise.then(function(_user) {
                    console.log(_user);
                    if (!_user) {
                        $state.go('signUp');
                    } else {
                        location.href = "index";
                    }
                }).catch(function(data) {
                    Error.openMessage(data.status);
                });
            }
        };

        auth.$onAuthStateChanged(function(firebaseUser) {
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
                        Error.openMessageByCode(299);
                    }).catch(function(data) {
                        Error.openMessage(data.status);
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
            auth.$signOut();
            //$sessionStorage.user.isLogedIn = false;
            $sessionStorage.token = false;
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
