app.controller('LoginCtrl', function($scope, $sessionStorage, Login) {
	$scope.getButtonText = function(){
		return $sessionStorage.token ? "Log out" : "Log in";
	};
	$scope.checkButtonClick = function(type){
		if($sessionStorage.token){
			Login.logOut();
		}else{
			Login.login(type);
		}
	};

	 $scope.firebaseUser = Login.getAuth();
});
