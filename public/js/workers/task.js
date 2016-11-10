
self.addEventListener('message', function (e) {
	if ('function' === typeof importScripts) {
		self.postMessage(e.data);
	}
}, false);

self.addEventListener('push', function(evt) {
  evt.waitUntil(
    self.registration.showNotification(
      '(プッシュ通知に表示するタイトル)',
      {
        icon: '(アイコンのURL(パスのみでOK))',
        body: '(プッシュ通知に表示する説明テキスト)',
        tag: '(識別用の適当なタグ("tag", "notification", 等)'
      }
    )
  );
}, false);

self.addEventListener('notificationclick', function(evt) {
  evt.notification.close();

  evt.waitUntil(
    clients.matchAll({ type: 'window' }).then(function(evt) {
      var p = location.pathname.split('/');
      p.pop();
      p = location.protocol + '//' + location.hostname + (location.port ? ':'+location.port : '') + p.join('/') + '/';
      for(var i = 0 ; i < evt.length ; i++) {
        var c = evt[i];
        if(((c.url == p) || (c.url == p + 'index.html')) && ('focus' in c))
          return c.focus();
      }
      if(clients.openWindow)
        return clients.openWindow('./');
    })
  );
}, false);