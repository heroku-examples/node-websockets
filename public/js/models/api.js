app.factory('Token', function($resource) {
    return $resource('/api/token/check', {}, {
        find: {
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
});

app.factory('CurrentUser', function($resource) {
    return $resource('/api/user', {}, {
        get: {
            method: 'POST',
            isArray: false
        }
    });
});

app.factory('User', function($resource) {
    return $resource('/api/users/:uid', {
        uid: '@uid'
    }, {
        get: {
            method: 'GET',
            isArray: false
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
            isArray: false
        },
        delete: {
            method: 'DELETE',
            isArray: false
        }
    });
});

app.factory('UserFind', function($resource) {
    return $resource('/api/users/find', {}, {
        find: {
            method: 'POST',
            isArray: false
        }
    });
});

