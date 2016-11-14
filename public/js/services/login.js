app
    .factory('Login', function($window, $filter, $location, $state, $localStorage, $sessionStorage, $firebaseAuth, Error, Loading, Link, User, Token, Json) {

        var auth = $firebaseAuth();
        var _this = { user: {} };

        Loading.initStart();

        var getCurrentUser = function(){
            User.current().get().$promise.then(function(_user) {
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
            if(location.pathname.includes('/main')){
                if(($window.session.token || $sessionStorage.token) && $sessionStorage.user){
                    if($sessionStorage.user.isEntry){
                        $state.go('userUpdate')
                    }else{
                        location.href = "/index";
                    }
                }
            }else if (!$sessionStorage.token && (location.pathname !== "/main" && location.pathname !== "/" && location.pathname !== "")) {
                location.href = "main";
            } else {
                if(!$sessionStorage.token) return;
                User.current().create().$promise.then(function(_user) {
                    if (!_user) {
                        if($state.current.name !== 'signUp' ) $state.go('signUp');
                        return;
                    } else if(_user.isEntry ){
                        _this.setUserSession(_user);
                        if($state.current.name !== 'userUpdate' ) $state.go('userUpdate');
                        return;
                    }
                    Loading.initFinish();
                }).catch(function(error) {
                    Error.openMessage(error);
                });
            }
            if($filter('isEmptyObj')(_this.user)){
                getCurrentUser();
            }
        };

        var stateChangedCount = 0;
        auth.$onAuthStateChanged(function(firebaseUser) {
            console.log('firebaseUser', firebaseUser)
            Loading.initStart();
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
                        if($localStorage.setting.enableSaveAuth)$localStorage.setting.token = _token;
                        checkUserToRedirect();

                    }).catch(function(error) {
                        Error.openMessage(error);
                        checkUserToRedirect();
                    });
                }).catch(function(error) {
                    Error.openMessage(error);
                    checkUserToRedirect();

                });
            } else {
                if(stateChangedCount) {
                    var UNAUTHORIZED = Error.searchErrorByKey("UNAUTHORIZED");
                    Error.openMessageByCode({'status': 401});
                    checkUserToRedirect();
                }
            }
            Loading.initFinish();
            stateChangedCount++;
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
            Loading.initStart();
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
            }else{
                auth.$signInWithRedirect(type).then(function() {
                    // Never called because of page redirect
                }).catch(function(error) {
                    console.error("Authentication failed:", error);
                });
            }

            
        };
        _this.logOut = function() {
            Loading.initStart();
            Token.delete().$promise.then(function(_token) {
                auth.$signOut();
                $sessionStorage.token = false;
                $sessionStorage.firebaseUser = false;
                if(!$localStorage.setting.enableSaveAuth)$localStorage.setting.token = false;
                Loading.initFinish();
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
