app.factory('Token', function($resource) {
    return $resource('/api/token', {}, {
        find: {
            method: 'POST',
            isArray: false
        },
        delete: {
            method: 'DELETE',
            isArray: false
        }
    });
});

app.factory('User', function($resource) {
    return {
        current : function(){
            return $resource('/api/current_user', {}, {
                get: {
                    method: 'GET',
                    isArray: false
                },
                create: {
                    method: 'POST'
                },
                update: {
                    method: 'PUT',
                    isArray: false
                },
                delete: {
                    method: 'DELETE',
                    isArray: false
                }
            });
        },
        token : function(){
            return $resource('/api/current_user/token', {}, {
                get: {
                    method: 'GET',
                    isArray: false
                }
            });
        },
        root :function(){
            return $resource('/api/user', {
                uid: '@uid'
            }, {
                get: {
                    method: 'GET',
                    isArray: false
                }
            });
        },
        all :function(){
            return $resource('/api/users', {}, {
                get: {
                    method: 'GET',
                    isArray: false
                },
                find: {
                    method: 'POST',
                    isArray: false
                }
            });
        }
    };
});

app.factory('FriendRequest', function($resource) {
    return {
        root :function(){
            return $resource('/api/friend_request/:targetUid', {targetUid: '@targetUid'}, {
                get: {
                    method: 'GET',
                    isArray: false
                }, // apiの戻り値が配列の場合は「isArray: true」を指定する
                create: {
                    method: 'POST',
                    isArray: false
                },
                update: {
                    method: 'PUT',
                    isArray: false
                },
                delete: {
                    method: 'DELETE',
                    isArray: false
                }
            });
        },
        reject :function(){
            return $resource('/api/friend_request/reject', {
                fromUid: '@fromUid'
            }, {
                get: {
                    method: 'GET',
                    isArray: false
                }, // apiの戻り値が配列の場合は「isArray: true」を指定する
                update: {
                    method: 'POST',
                    isArray: false
                },
            });
        },
        apply :function(){
            return $resource('/api/friend_request/apply/:fromUid', {fromUid: '@fromUid'}, {
                get: {
                    method: 'GET',
                    isArray: false
                }, // apiの戻り値が配列の場合は「isArray: true」を指定する
                update: {
                    method: 'POST',
                    isArray: false
                },
            });
        },
        all :function(){
            return $resource('/api/friend_requests', {}, {
                get: {
                    method: 'GET',
                    isArray: false
                },
                find: {
                    method: 'POST',
                    isArray: false
                }
            });
        }
    }
});

