app.factory('Profile', function($resource) {
    return $resource('/api/files/profile', {
        uid: '@uid'
    }, {
        get: {
            method: 'GET'
        },
        delete: {
            method: 'DELETE'
        }
    });
});

app.factory('SyncProfile', function($resource) {
    return $resource('/api/files/profile/sync_by_json', {
        uid: '@uid'
    }, {
        post: {
            method: 'post'
        }
    });
});

app.factory('Location', function($resource) {
    return $resource('/api/files/location', {
        uid: '@uid'
    }, {
        get: {
            method: 'GET'
        },
        delete: {
            method: 'DELETE'
        }
    });
});

app.factory('SyncLocation', function($resource) {
    return $resource('/api/files/location/sync_by_json', {
        uid: '@uid'
    }, {
        post: {
            method: 'post'
        }
    });
});

app.factory('LangJa', function($resource) {
    return $resource('/api/files/lang/ja', {
        uid: '@uid'
    }, {
        get: {
            method: 'GET'
        },
        delete: {
            method: 'DELETE'
        }
    });
});

app.factory('SyncLangJa', function($resource) {
    return $resource('/api/files/lang/ja/sync_by_json', {
        uid: '@uid'
    }, {
        post: {
            method: 'post'
        }
    });
});

app.factory('Config', function($resource) {
    return $resource('/api/configs', {}, {
        get: {
            method: 'GET',
            isArray: false
        },
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

app.factory('Debug', function($resource) {
    return $resource('/api/debugs', {}, {
        get: {
            method: 'GET',
            isArray: false
        },
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
