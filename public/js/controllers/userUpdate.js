app.controller('UserUpdateCtrl', function($scope, Login) {
    $scope.showDarkTheme = true;
    $scope.tabs = [
        {
            id : 1,
            name: 'tab1',
            explain: 'Name',
            tempateUrl: '/templates/elements/userUpdates/1.html',
            params :{}
        },
        {
            id : 2,
            name: 'tab2',
            explain: 'Birthday',
            tempateUrl: '/templates/elements/userUpdates/2.html',
            params :{}
        },
        {
            id : 3,
            name: 'tab3',
            explain: 'Prefecture',
            tempateUrl: '/templates/elements/userUpdates/3.html',
            params :{}
        },
        {
            id : 4,
            name: 'tab4',
            explain: 'avatar',
            tempateUrl: '/templates/elements/userUpdates/4.html',
            params :{}
        }
    ];
    $scope.data = {
      selectedIndex: 0,
    };
    $scope.next = function() {
      $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2) ;
    };
    $scope.previous = function() {
      $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
    };
    $scope.data = {
      selectedIndex: 0,
      secondLabel:   "Item Two",
    };
    $scope.next = function() {
      $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2) ;
    };
    $scope.previous = function() {
      $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
    };

  $scope.myDate = new Date();

  $scope.minDate = new Date(
      $scope.myDate.getFullYear()-100,
      $scope.myDate.getMonth() - 2,
      $scope.myDate.getDate());

  $scope.maxDate = new Date(
      $scope.myDate.getFullYear()-16,
      $scope.myDate.getMonth(),
      $scope.myDate.getDate());
});
