function ConfigModalCtrl($scope, $mdDialog, locals, Login, $controller) {
	$controller(ModalCtrl, {$scope :$scope, $mdDialog : $mdDialog, locals: locals, Login :Login});
}
