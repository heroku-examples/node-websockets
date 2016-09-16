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
    .factory('Login', function($window, $localStorage, $sessionStorage, $firebaseAuth, Link, User, Token) {
        var auth = $firebaseAuth();
        var _this = { isLoading: true, user: {} };

        if($sessionStorage.user && $sessionStorage.user.isLogedIn){
            _this.user = User.getCurrent();
        }

        auth.$onAuthStateChanged(function(firebaseUser) {
            if (firebaseUser && !_this.checkUser()) {

                $sessionStorage.user = {
                    displayName: firebaseUser.displayName,
                    email: firebaseUser.email,
                    emailVerified: firebaseUser.emailVerified,
                    isAnonymous: firebaseUser.isAnonymous,
                    isLogedIn: true,
                };
                if(!$localStorage.user) $localStorage.user = {};
                $localStorage.user.displayName = firebaseUser.displayName,
                $localStorage.user.email = firebaseUser.email,
                $localStorage.user.uid = firebaseUser.uid,
                $localStorage.user.isCordovaApp = $window.isCordovaApp;

                _this.user = User.getCurrent();
                _this.user.$loaded().then(function(user) {
                    if (_this.user.uid !== $localStorage.user.uid) {
                        Loading.start();
                        _this.user.name = $localStorage.user.displayName;
                        _this.user.age = 0;
                        //1:men, 2 :women, 3   = other
                        _this.user.sexType = 1;
                        _this.user.message = 'よろしくね';
                        _this.user.date = Math.round(new Date().getTime() / 1000);
                        _this.user.uid = $localStorage.user.uid;
                        _this.user.photoURL = $sessionStorage.user.photoURL;
                        _this.user.imageUrl = null;
                        _this.user.platform = ionic.Platform.platform();
                        _this.user.platformVersion = ionic.Platform.version();
                        _this.selectedPhoto = $sessionStorage.user.photoURL;
                        _this.user.$save().then(function(ref) {
                            Loading.finish();
                        });
                    }
                    if (typeof user == 'object') {
                        $sessionStorage.user.photoURL = _this.user.photoURL;
                        $localStorage.user.name = _this.user.name;
                    }
                    _this.isLoading = false;
                });
                
                alert("login")

            }else{
                console.log( _this.user );
            }
            var user = firebase.auth().currentUser;
            var token = '';
            user.getToken().then(function(idToken) {
                Token.find({ token: idToken }).$promise.then(function(res) {
                    console.log(2, res);
                }).catch(function(data, status) {
                    alert('error');
                });
            }).catch(function(error) {
                alert("error");
            });


        });


        _this.login = function(type) {
            _this.isLoading = true;
            if (type != 'google') {
                auth.$signInWithEmailAndPassword($localStorage.user.email, $localStorage.user.password).then(function(firebaseUser) {
                    console.log("Signed in as:", firebaseUser.uid);
                }).catch(function(error) {
                    console.error("Authentication failed:", error);
                });
            }else if (type == 'google') {
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
        _this.logout = function() {
            auth.$signOut();
            $sessionStorage.user.isLogedIn = false;
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
