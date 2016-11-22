'use strict';

self.addEventListener('install', function(event){
    // console.info('install', event);
    
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event){
    // console.info('activate', event);
    
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event){
    // console.info('fetch', event);
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