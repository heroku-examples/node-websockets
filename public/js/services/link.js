app
    .factory('Link', function($state, $localStorage) {
        var _this = {};
        _this.goFriend = function(user) {
            $state.go('friend', { key: user.uid, value: { uid: user.uid, name: user.name } });
        };
        _this.goChat = function(user) {
            $state.go('privateChat', { key: $localStorage.user.uid, value: { uid: user.uid, name: user.name } });
        };
        _this.goImages = function(user, images) {
            $state.go('images', { key: user.uid, value: { images: images, uid: user.uid, name: user.name } });
        };
        _this.goLogin = function() {
            $state.go('login');
        };
        _this.goChatList = function() {
            $state.go('chatList');
        };
        _this.goBlogList = function(user, blogId) {
            $state.go('blogList');
        };
        _this.goBlog = function(user, blogId) {
            $state.go('blog', { key: user.uid, value: { uid: user.uid, id: blogId } });
        };
        _this.goMaps = function(latitude, longitude, title) {
            $state.go('maps', { value: { latitude: latitude, longitude: longitude, title: title } });
        };
        return _this;
    });