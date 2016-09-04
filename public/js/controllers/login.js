app.controller('LoginCtrl', function($scope, Login) {
	$scope.login = function(type) {
	  Login.login(type);
	};
});
