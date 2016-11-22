app
    .factory('FireBaseStorageService', function($window, $filter, $rootScope) {
        var objRef = {};
        var _this = {
            objRef: {},
            urls: {}
        };

        var init = function() {
            objRef = firebase.storage().ref();
        };

        var setObjRef = function(key, path, fileName) {
            _this.objRef[key] = objRef.child(path).child(fileName);
            return _this.objRef[key];
        };

        _this.getImageObjRef = function(fileName, key) {
            objRef.child(fileName).getDownloadURL().then(function(url) {
                _this.urls[key] = url;
                $rootScope.$broadcast('updated');
            }).catch(function(error) {
                // Handle any errors
            });
        };

        _this.setObjRef = function(key, path, fileName) {
            return setObjRef(key, path, fileName);
        };

        init();
        return _this;
    })
    .factory('File', function(resizeService, FireBaseStorageService, $filter, $q, $log) {
        var _this = { isLoding: false };
        var chatRef = {};

        function toBlob(base64) {
            var bin = atob(base64.replace(/^.*,/, ''));
            var buffer = new Uint8Array(bin.length);
            for (var i = 0; i < bin.length; i++) {
                buffer[i] = bin.charCodeAt(i);
            }
            // Blobを作成
            var blob;
            try {
                blob = new Blob([buffer.buffer], {
                    type: 'image/png'
                });
            } catch (e) {
                return false;
            }
            return blob;
        }

        _this.readURL = function(file, d, isBlob) {
            var reader = new FileReader();
            if (file.isBlob) {
                d.resolve(toBlob(file.src));
            } else if (isBlob) {
                d.resolve(toBlob(file));
            } else {
                reader.readAsDataURL(file);
            }

            reader.onload = function(e) {
                return d.resolve(e.target.result);
            };

        };

        _this.get = function(key, path, fileName) {
            var d = $q.defer();
            ref = FireBaseStorageService.setObjRef(key, path, fileName);
            ref.getDownloadURL().then(function(url) {
                d.resolve(url);
            }).catch(function(error) {
                d.resolve('error');
            });
            return d.promise;
        };

        _this.uploadTask = function(key, path, file) {
            if (!file) return;
            var d = $q.defer();
            var fileName = '';
            if (!file.name) {
                fileName = Math.round(new Date().getTime() / 1000) + '.jpeg';
            }
            ref = FireBaseStorageService.setObjRef(key, path, fileName);

            var uploadTask = ref.put(file);
            uploadTask.on('state_changed', function(snapshot) {
                //d.resolve(snapshot);
            }, function(error) {
                d.resolve(error);
            }, function(snapshot) {
                d.resolve(uploadTask.snapshot.downloadURL);
            });
            return d.promise;
        };

       _this.resizeUpload = function(file, key, path) {
            if (!file) return;
            var d = $q.defer();
            _this.resizeFile(file).then(function(resized) {
                _this.getUploadFile(resized.file).then(function(resizedUploadFileUrl) {
                    _this.uploadTask(key, path, resizedUploadFileUrl).then(function(uploadedImageUrl) {
                        d.resolve(uploadedImageUrl);
                    });
                });
            });
            return d.promise;
        };

       _this._upload = function(file, isBlob, key, path) {
            if (!file) return;
            var d = $q.defer();
            _this.getUploadFile(file, isBlob).then(function(fileUrl) {
                _this.uploadTask(key, path, fileUrl).then(function(uploadedFileUrl) {
                     d.resolve(uploadedFileUrl);
                });
             });
            return d.promise;
        };

        _this.getUploadFile = function(file, isBlob) {
            if (!file) return;
            var d = $q.defer();
            _this.readURL(file, d, isBlob);
            return d.promise;
        };

        _this.resizeFile = function(url) {
            if (!url) return;
            var d = $q.defer();
            resizeService
                .resizeImage(url, {
                    size: 2,
                    sizeScale: 'ko',
                    width: 320
                        // Other options ...
                })
                .then(function(image) {
                    // Add the resized image into the body
                    var file = document.createElement('img');
                    file.src = image;
                    file.isBlob = true;
                    d.resolve({ src: image, file: file });
                })
                .catch($log.error); // Always catch a promise :)
            return d.promise;
        };

        _this.getFileType = function(name) {
            var fileType = name.split('.').pop().split('?')[0];
            if ($filter('inArray')(['png', 'jpg', 'gif', 'bmp', 'jpeg'], fileType)) {
                return 'image';
            } else if ($filter('inArray')(['mp3', 'wav', 'm4a'], fileType)) {
                return 'sound';
            } else if ($filter('inArray')(['wmv', 'mp4', 'mpeg', 'mov', 'avi'], fileType)) {
                return 'movie';
            }
        };
        return _this;
    });
