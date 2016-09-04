app
   .factory('User', function($filter, FireBaseService, $firebaseObject, $firebaseArray, $localStorage) {
        var _this = {
            users: {},
            indexs : {
                prefecture_city_sexType_age : {
                    names : ['prefecture', 'city', 'sexType', 'age'],
                    keys : ['prefectureId','cityId', 'sexType', 'age']
                },
                prefecture_city_sexType : {
                    names : ['prefecture', 'city', 'sexType'],
                    keys : ['prefectureId','cityId', 'sexType']
                },
                prefecture_sexType_age : {
                    names : ['prefecture', 'sexType', 'age'],
                    keys : ['prefectureId', 'sexType', 'age']
                },
                prefecture_sexType : {
                    names : ['prefecture', 'sexType'],
                    keys : ['prefectureId', 'sexType']
                },
                sexType_age : {
                    names : ['sexType', 'age'],
                    keys : ['sexType', 'age']
                },
            }
        };
        if (!FireBaseService.arrayRef.users) FireBaseService.setArrayRef('users', 'users');

        _this.getCurrent = function() {
            if (!_this.users[$localStorage.user.uid]) _this.users[$localStorage.user.uid] = FireBaseService.arrayRef.users.child($localStorage.user.uid);
            return $firebaseObject(_this.users[$localStorage.user.uid]);
        };

        _this.getById = function(uid) {
            if (!_this.users[uid]) _this.users[uid] = FireBaseService.arrayRef.users.child(uid);
            return $firebaseObject(_this.users[uid]);
        };
        _this.formatFirst = function(users) {
            var user = {};
            var count = 0;
            angular.forEach(users, function(userDetail, userDetailKey) {
                if (!$filter('inArray')(['$$conf', '$id', '$priority'], userDetailKey) && !count) {
                    user = userDetail;
                    user.Key = userDetailKey;
                }
            });
            return user;
        };
        _this.formatUid = function(users, isEmpty, isAll, isFirst) {
            var uids = [];
            var uid = '';
            var count = 0;
            angular.forEach(users, function(userDetail, userDetailKey) {
                if ((isEmpty && !userDetail) || (!isEmpty && userDetail) || isAll) {
                    if (!$filter('inArray')(['$$conf', '$id', '$priority'], userDetailKey)) {
                        if (isFirst) {
                            if (!count) uid = userDetailKey;
                        } else {
                            uids.push(userDetailKey);
                        }
                        count++;
                    }
                }

            });
            if (isFirst) {
                return uid;
            } else {
                return uids;
            }
        };
        _this.setIndex = function(user) {
            var result = user;
            angular.forEach(_this.indexs, function(indexDetail, indexName) {
                var strings = [];
                angular.forEach(indexDetail.keys, function(name, index) {
                    strings[index] = user[name] ? user[name] : 0;
                });
                result[indexName] = strings.join('_');
            });
            return result;
        };
        return _this;
    })
    .factory('Users', function(FireBaseService, $firebaseObject, $firebaseArray) {
        var _this = {};
        if (!FireBaseService.arrayRef.users) FireBaseService.setArrayRef('users', 'users');
        var usersRef = FireBaseService.arrayRef.users;
        _this.get = function() {
            return $firebaseArray(usersRef);
        };

        _this.getByCondition = function() {
            FireBaseService.setArrayRef('users', 'users', [{key : 'isDebug', value : true, type : 'equalTo'}]);
            var usersRef = FireBaseService.arrayRef.users;
            return $firebaseArray(usersRef);
        };
        return _this;
    })
