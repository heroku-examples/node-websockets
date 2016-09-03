app.factory('Json', function($http, $q, $localStorage) {
        if(!$localStorage.json) $localStorage.json = {};
        var _this = { isLoding: false };
        _this.get = function(path) {
            var d = $q.defer();
            if($localStorage.json[path]){
                d.resolve($localStorage.json[path]);
            }else{
                $http.get(path)
                    .then(function(response) {
                        //First function handles success
                        $localStorage.json[path] = response.data;
                        d.resolve(response.data);
                    }, function(response) {
                        //Second function handles error
                        d.resolve(null);
                    });
                }
            return d.promise;
        };
        return _this;
    });
