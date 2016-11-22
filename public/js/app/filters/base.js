//$filter('find')($scope.List,{id : hogeId}, true);
app.filter('find', function() {
        return function(input, value, isFirst) {
            if (!Array.isArray(input)) return false;
            var existList = [];
            var keys = Object.keys(value);
            for (var i = 0; i < input.length; i++) {
                var isOk = false;
                for (var j = 0; j < keys.length; j++) {
                    var inputVal = input[i][keys[j]];
                    var judgeVal = value[keys[j]];
                    if (inputVal != judgeVal) {
                        if (judgeVal === "boolean") {
                            if (inputVal) {
                                isOk = true;
                            } else {
                                continue;
                            }
                        } else {
                            continue;
                        }
                    } else {
                        isOk = true;
                    }
                }
                if (isOk) {
                    input[i].index = i;
                    existList.push(input[i]);
                    if (isFirst) return existList[0];
                }
            }
            return existList;
        };
    })
    //ng-if="items | inArray : 'test'" あればtrue なければfalse
    //$filter('inArray')(items,'test');
    .filter('inArray', function() {
        return function(array, value) {
            if (!Array.isArray(array)) return false;
            return array.indexOf(value) !== -1;
        };
    })
    //<div ng-repeat="(date,text) in data | orderObjectBy:date:true">{{text}}</div>
    .filter('orderObjectBy', function() {
        return function(items, field, reverse) {
            var filtered = [];
            angular.forEach(items, function(item, primaryKey) {
                item.primaryKey = primaryKey;
                filtered.push(item);
            });
            filtered.sort(function(a, b) {
                return (a[field] > b[field] ? 1 : -1);
            });
            if (reverse) filtered.reverse();
            return filtered;
        };
    })

    //$filter('rand')(10)
    .filter('rand', function() {
        return function(num) {
            return Math.floor(Math.random() * num + 1);
        };
    })
    .filter('removeEmptyInObject', function() {
        return function(input) {
            angular.forEach(input, function(value, key) {
                if (value == "" || value == null || value == "0") {
                    delete input[key];
                }
            });
            return input;
        };
    })
    .filter('nl2br', function($sce) {
        return function(msg, is_xhtml) {
            var is_xhtml = is_xhtml || true;
            var breakTag = (is_xhtml) ? '<br />' : '<br>';
            var msg = (msg + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
            return $sce.trustAsHtml(msg);
        };
    })
    // Usage:$filter('sprintf')("Hello %s. It's %s to see you!","World","very");
    .filter('sprintf', function() {
        function parse(str) {
            var args = [].slice.call(arguments, 1),
                i = 0;

            return str.replace(/%s/g, function() {
                return args[i++];
            });
        }

        return function(str) {
            return parse(str, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
        };
    })
    // Usage:$filter('isEmptyObj')(obj)
    // ng-if="obj | isEmptyObj"
    .filter('isEmptyObj', function() {
        return function(obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop))
                    return false;
            }
            return true;
        };
    })

