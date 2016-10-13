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

app.factory('User', function($resource) {
    return $resource('/api/users/:uid', {
        uid: '@uid'
    }, {
        get: {
            method: 'GET',
            isArray: true
        }, // apiの戻り値が配列の場合は「isArray: true」を指定する
        find: {
            method: 'GET',
            isArray: false
        },
        create: {
            method: 'POST'
        },
        update: {
            method: 'PUT',
            isArray: true
        },
        delete: {
            method: 'DELETE',
            isArray: true
        }
    });
});

app.factory('UserFind', function($resource) {
    return $resource('/api/users/find', {}, {
        find: {
            method: 'POST',
            isArray: true
        }
    });
});

