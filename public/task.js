
// self.addEventListener('message', function (e) {
// 	if ('function' === typeof importScripts) {
// 		self.postMessage(e.data);
// 	}
// }, false);

self.addEventListener('push', function(evt) {
	console.log(evt)
  //if(evt.data) {
    //var data = evt.data.json();
    evt.waitUntil(
      self.registration.showNotification(
        'data.title',
        {
          icon: 'xxx.png',
          body: 'data',
          tag:"pushMessage201512080001"
        }
      )
    );
  //}
}, false);