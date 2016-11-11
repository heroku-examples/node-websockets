'use strict';
//https://github.com/kanatapple/service-worker/tree/gh-pages/push
self.addEventListener('install', function (event) {
    console.info('install', event);

    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {
    console.info('activate', event);

    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function (event) {
    console.info('fetch', event);
});

self.addEventListener('push', function (event) {

    console.log('Received a push message', event);

    var _title = 'メッセージのタイトル';
    var _text = 'プッシュメッセージを受信';
    var _icon = 'https://kanatapple.github.io/service-worker/push/images/image.jpg';
    var _tag = 'push-notification-tag';

    console.log('receive Data: ', event.data);
    if (event.data != null) {
        var textdata = event.data.text();
        var result = JSON.parse(textdata);

        if( typeof result == 'object'){
            _text = result.text? result.text : text;
            _title = result.data.title? result.data.title : title;
            _icon = result.data.photoURL? result.data.photoURL : icon;
        }else{
            _text = event.data.text();
            _title = title;
            _icon = icon;
        }

    }

    event.waitUntil(
        self.registration.showNotification(_title, {
            body: _text,
            icon: _icon,
            tag: _tag
        })
    );
});


//https://developers.google.com/web/fundamentals/engage-and-retain/push-notifications/sending-messages
//curl --header "Authorization: key=AIzaSyABUweSPHa_1XDaXmhXU0RhMGZokiJIapY" --header Content-Type:"application/json" https://android.googleapis.com/gcm/send -d "{\"registration_ids\":[\"frx00nNJx6k:APA91bFDsvSXLxDIVMlrKbtYMwwJI0mqicxJpKJUJw18gMawtMNkxljpd34ilE4aL7uvvHSz5PR8LxlfyONWbtsRA2R7j7P2uzw1pWQjpc5VJKA_J0Y0i15d4ASV35jB7jpyFHMbvexn\"],\"data\":{\"message\":\"Hello\"}}"

//%curl --header "Authorization: key=＜API KEY＞" --header Content-Type:"application/json" https://android.googleapis.com/gcm/send -d "{\"registration_ids\":[\"＜RegistrationID＞\"],\"data\":{\"message\":\"Hello\"}}"