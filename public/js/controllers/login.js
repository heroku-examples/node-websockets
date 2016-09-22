app.controller('LoginCtrl', function($scope, Login) {
	$scope.login = function(type) {
	  Login.login(type);
	};
	$scope.logOut = function(type) {
	  Login.logOut(type);
	};

	 $scope.firebaseUser = Login.getAuth();
});
