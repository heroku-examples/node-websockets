app.controller('UserUpdateCtrl', function($scope, $filter, Json, Loading, Toast, Login, File, User, Error) {
    $scope.myDate = new Date();

    console.log('getUser', Login.getUser());
    console.log('getFirebaseUser', Login.getFirebaseUser());

    Json.get('location').then(function(prefectures) {
        console.log(prefectures)
        $scope.prefectures = prefectures;
    });

    var user = Login.user;

    var minDate = new Date(
        $scope.myDate.getFullYear() - 100,
        $scope.myDate.getMonth() - 2,
        $scope.myDate.getDate()
    );

    var maxDate = new Date(
        $scope.myDate.getFullYear() - 16,
        $scope.myDate.getMonth(),
        $scope.myDate.getDate()
    );

    $scope.showDarkTheme = true;
    $scope.tabs = [{
        id: 1,
        name: 'Name',
        explain: 'Name',
        tempateUrl: '/templates/elements/userUpdates/name.html',
        params: {
            firstName : { type : "String", max : 10, min : 1},
            lastName : { type : "String", max : 10, min : 1}
        },
        values : {
            firstName : user.firstName? user.firstName : false,
            lastName : user.lastName? user.lastName : false
        }
    },
    // {
    //     id: 2,
    //     name: 'Birthday',
    //     explain: 'Birthday',
    //     tempateUrl: '/templates/elements/userUpdates/age.html',
    //     params: {
    //         "birthday" : { type : "Date", max : maxDate, min : minDate},
    //         "sexType" : { type : "Number", max : 2, min : 1}
    //     },
    //     values : { birthday : false }
    // },
     {
        id: 2,
        name: 'Age',
        explain: 'Age',
        tempateUrl: '/templates/elements/userUpdates/age.html',
        params: {
            age : { type : "Number", max : 100, min : 20},
            sexType : { type : "Number", max : 2, min : 1}
        },
        values : {
            age : user.age? user.age : false,
            sexType : user.sexType? user.sexType : false,
        }
    }, {
        id: 3,
        name: 'Prefecture',
        explain: 'Prefecture',
        tempateUrl: '/templates/elements/userUpdates/prefecture.html',
        params: {
            refectureId : { type : "Mumber", max : 100, min : 1},
            cityId : { type : "Mumber", max : 100, min : 1}
        },
        values : {
            cityId : user.cityId? user.cityId : false,
            prefectureId : user.prefectureId? user.prefectureId : false
        }
    }, {
        id: 4,
        name: 'Avatar',
        explain: 'avatar',
        tempateUrl: '/templates/elements/userUpdates/avatar.html',
        params: {
            avatarId : { type : "Mumber", max : 100, min : 1}
        },
        values : { avatarId : user.avatarId? user.avatarId : false }
    }, {
        id: 5,
        name: 'Image',
        explain: 'image',
        tempateUrl: '/templates/elements/userUpdates/photo.html',
        params: {
            photoURL : { type : "String" }
        },
        values : { photoURL : user.photoURL? user.photoURL : false }
    }];

    //tabs
    $scope.data = {
        selectedIndex: 0
    };

    $scope.next = function() {
        $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, $scope.tabs.length);
    };
    $scope.previous = function() {
        $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
    };

    $scope.sexTypes = [
        {id : 1, name : 'male'},
        {id : 2, name : 'female'}
    ];

    $scope.myImage = '';
    $scope.file='';

    $scope.cropper = {
        background: {
            w: 500,
            h: 500
        },
        normal: {
            w: 200,
            h: 200
        }
    };

    var getTabIndexByName = function(conditon){
        var tab = $filter('find')($scope.tabs,conditon, true);
        return tab.index;
    };

    var handleFileSelect = function(evt) {
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function(evt) {
            $scope.$apply(function($scope) {
                $scope.myImage = evt.target.result;
            });
        };
        reader.readAsDataURL(file);
    };

    var update = function(){
        Loading.start();
        var params = {};
        angular.forEach($scope.tabs, function(tab, key){
            angular.forEach(tab.values, function(value, key){
                params[key] = value;
            });
        });
        User.update(params).$promise.then(function(_user) {
            Loading.finish();
            Login.updateUser(_user);
            Toast.show("success");
        }).catch(function(data) {
            Error.openMessage(_user.status);
        });
    };

    $scope.finish = function() {
        update();
    };

    $scope.upload = function() {
        angular.element(document.querySelector('.upload_photo_modal')).on('change', handleFileSelect);
        var el = angular.element(document.querySelector('.upload_photo_modal'));
        angular.element(el).click();
    };

    $scope.selectAvatar = function(id){
        var index = getTabIndexByName({name : "Avatar"});
        $scope.tabs[index].values.avatarId = id;
    };

    $scope.imageCroped = function(_file) {
        $scope.isFileUploading = true;
        File._upload(_file, true, 'users', 'users').then(function(uploadedImageUrl) {
            var index = getTabIndexByName({name : "Image"});
            $scope.tabs[index].values.photoURL = uploadedImageUrl;
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        });
    };
});
