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

    var title = 'メッセージのタイトル';
    var body = 'プッシュメッセージを受信';
    var icon = 'https://kanatapple.github.io/service-worker/push/images/image.jpg';
    var tag = 'push-notification-tag';

    console.log('receive Data: ', event.data);
    if (event.data != null) {
        var textdata = event.data.text();
        console.log('receive text: ', textdata);
        body = body + ":" + textdata;
    }

    event.waitUntil(
        self.registration.showNotification(title, {
            body: body,
            icon: icon,
            tag: tag
        })
    );
});

//curl --header "Authorization: key=AIzaSyABUweSPHa_1XDaXmhXU0RhMGZokiJIapY" --header Content-Type:"application/json" https://android.googleapis.com/gcm/send -d "{\"registration_ids\":[\"frx00nNJx6k:APA91bFDsvSXLxDIVMlrKbtYMwwJI0mqicxJpKJUJw18gMawtMNkxljpd34ilE4aL7uvvHSz5PR8LxlfyONWbtsRA2R7j7P2uzw1pWQjpc5VJKA_J0Y0i15d4ASV35jB7jpyFHMbvexn\"],\"data\":{\"message\":\"Hello\"}}"

//%curl --header "Authorization: key=＜API KEY＞" --header Content-Type:"application/json" https://android.googleapis.com/gcm/send -d "{\"registration_ids\":[\"＜RegistrationID＞\"],\"data\":{\"message\":\"Hello\"}}"