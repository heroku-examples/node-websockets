'use strict';
//https://github.com/kanatapple/service-worker/tree/gh-pages/push
self.addEventListener('install', function(event){
    console.info('install', event);
    
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event){
    console.info('activate', event);
    
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event){
    console.info('fetch', event);
});

self.addEventListener('push', function(event){
    console.info('push', event);
    
    const message = event.data ? event.data.text() : '(・∀・)';
    
    event.waitUntil(
        self.registration.showNotification('Push Notification Title', {
            body: message,
            icon: 'https://kanatapple.github.io/service-worker/push/images/image.jpg',
            tag: 'push-notification-tag'
        })
    );
});

//curl --header "Authorization: key=	AIzaSyAFw6KYu4W5kTmKPnFA8pllyDyFfYtH4q8" --header Content-Type:"application/json" https://android.googleapis.com/gcm/send -d "{\"registration_ids\":[\"eOM5WXCJoOU:APA91bEysh0oETvrcmYdqgqS3Sr83XZEUgOrCR801Sfw94SetzRMKKj-Tn135mm4BIyS79tRwTw8OE3tLTxUU_OYUajj4v_OOhxU_DxR5ONu0wdMMRAGBLERa8Ilx3XnNxfVGnLwWyTu\"]}"

//%curl --header "Authorization: key=	AIzaSyAFw6KYu4W5kTmKPnFA8pllyDyFfYtH4q8" --header Content-Type:"application/json" https://android.googleapis.com/gcm/send -d "{\"registration_ids\":[\"eOM5WXCJoOU:APA91bEysh0oETvrcmYdqgqS3Sr83XZEUgOrCR801Sfw94SetzRMKKj-Tn135mm4BIyS79tRwTw8OE3tLTxUU_OYUajj4v_OOhxU_DxR5ONu0wdMMRAGBLERa8Ilx3XnNxfVGnLwWyTu\"],\"data\":{\"message\":\"Hello\"}}"

//%curl --header "Authorization: key=＜API KEY＞" --header Content-Type:"application/json" https://android.googleapis.com/gcm/send -d "{\"registration_ids\":[\"＜RegistrationID＞\"],\"data\":{\"message\":\"Hello\"}}"

//https://android.googleapis.com/gcm/send/eOM5WXCJoOU:APA91bEysh0oETvrcmYdqgqS3Sr83XZEUgOrCR801Sfw94SetzRMKKj-Tn135mm4BIyS79tRwTw8OE3tLTxUU_OYUajj4v_OOhxU_DxR5ONu0wdMMRAGBLERa8Ilx3XnNxfVGnLwWyTu