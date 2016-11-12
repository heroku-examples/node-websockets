app
    .factory('Worker', function ($q, $sessionStorage, Push, Toast, Error) {
        var _this = {
            worker: {},
            resouces: {
                simple: '/task.js?v=' + window.deviceCacheKey
            }
        };

        var isPushEnabled = true;

        window.addEventListener('load', function () {
            var pushButton = document.querySelector('.js-push-button');
            // pushButton.addEventListener('click', function () {
            //     if (isPushEnabled) {
            //         unsubscribe();
            //    } else {
                   subscribe();
            //    }
            //});

            // Check that service workers are supported, if so, progressively  
            // enhance and add push messaging support, otherwise continue without it.  
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register(_this.resouces['simple'])
                    .then(initialiseState);
            } else {
                console.warn('Service workers aren\'t supported in this browser.');
            }
        });


        var sendSubscriptionToServer = function (subscription) {
            var registrationId = "";
            var subscriptionStr = JSON.stringify(subscription)
            var subscriptionJson = JSON.parse(subscriptionStr)

            if (subscription.endpoint && $sessionStorage.user) {
                endpoint = 'https://android.googleapis.com/gcm/send';
                endpointParts = subscription.endpoint.split('/');
                registrationId = endpointParts[endpointParts.length - 1];
                
                Push.root().send({ endpoint : subscriptionJson.endpoint, registrationIds: [registrationId], p256dh : subscriptionJson.keys.p256dh, auth : subscriptionJson.keys.auth }).$promise.then(function (result) {
                    console.info(result)
                    Toast.show("Pushed");
                }).catch(function (data, status) {
                    Error.openMessage(data, status);
                });
            }
        }

        var initialiseState = function () {
            // Are Notifications supported in the service worker?  
            if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
                console.warn('Notifications aren\'t supported.');
                return;
            }

            // Check the current Notification permission.  
            // If its denied, it's a permanent block until the  
            // user changes the permission  
            if (Notification.permission === 'denied') {
                console.warn('The user has blocked notifications.');
                return;
            }

            // Check if push messaging is supported  
            if (!('PushManager' in window)) {
                console.warn('Push messaging isn\'t supported.');
                return;
            }

            // We need the service worker registration to check for a subscription  
            navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
                // Do we already have a push message subscription?  
                serviceWorkerRegistration.pushManager.getSubscription()
                    .then(function (subscription) {
                        // Enable any UI which subscribes / unsubscribes from  
                        // push messages.  
                        //var pushButton = document.querySelector('.js-push-button');
                        //pushButton.disabled = false;

                        if (!subscription) {
                            // We aren't subscribed to push, so set UI  
                            // to allow the user to enable push  
                            return;
                        }

                        // Keep your server in sync with the latest subscriptionId
                        sendSubscriptionToServer(subscription);

                        // Set your UI to show they have subscribed for  
                        // push messages  
                        //pushButton.textContent = 'Disable Push Messages';
                        //isPushEnabled = true;
                    })
                    .catch(function (err) {
                        console.warn('Error during getSubscription()', err);
                    });
            });
        }

        var subscribe = function () {
            // Disable the button so it can't be changed while  
            // we process the permission request  
           // var pushButton = document.querySelector('.js-push-button');
            //pushButton.disabled = true;

            navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
                serviceWorkerRegistration.pushManager.subscribe({ userVisibleOnly: true })
                    .then(function (subscription) {
                        // The subscription was successful  
                        //isPushEnabled = true;
                        //pushButton.textContent = 'Disable Push Messages';
                        //pushButton.disabled = false;

                        // TODO: Send the subscription.endpoint to your server  
                        // and save it to send a push message at a later date
                        return sendSubscriptionToServer(subscription);
                    })
                    .catch(function (e) {
                        if (Notification.permission === 'denied') {
                            // The user denied the notification permission which  
                            // means we failed to subscribe and the user will need  
                            // to manually change the notification permission to  
                            // subscribe to push messages  
                            console.warn('Permission for Notifications was denied');
                            //pushButton.disabled = true;
                        } else {
                            // A problem occurred with the subscription; common reasons  
                            // include network errors, and lacking gcm_sender_id and/or  
                            // gcm_user_visible_only in the manifest.  
                            console.error('Unable to subscribe to push.', e);
                            //pushButton.disabled = false;
                            //pushButton.textContent = 'Enable Push Messages';
                        }
                    });
            });
        }

        var unsubscribe = function () {
            //var pushButton = document.querySelector('.js-push-button');
            //pushButton.disabled = true;

            navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
                // To unsubscribe from push messaging, you need get the  
                // subscription object, which you can call unsubscribe() on.  
                serviceWorkerRegistration.pushManager.getSubscription().then(
                    function (pushSubscription) {
                        // Check we have a subscription to unsubscribe  
                        if (!pushSubscription) {
                            // No subscription object, so set the state  
                            // to allow the user to subscribe to push  
                            //isPushEnabled = false;
                            // pushButton.disabled = false;
                            // pushButton.textContent = 'Enable Push Messages';
                            return;
                        }

                        var subscriptionId = pushSubscription.subscriptionId;
                        // TODO: Make a request to your server to remove  
                        // the subscriptionId from your data store so you
                        // don't attempt to send them push messages anymore

                        // We have a subscription, so call unsubscribe on it  
                        pushSubscription.unsubscribe().then(function (successful) {
                            // pushButton.disabled = false;
                            // pushButton.textContent = 'Enable Push Messages';
                            //isPushEnabled = false;
                        }).catch(function (e) {
                            // We failed to unsubscribe, this can lead to  
                            // an unusual state, so may be best to remove
                            // the users data from your data store and
                            // inform the user that you have done so

                            console.log('Unsubscription error: ', e);
                            pushButton.disabled = false;
                            pushButton.textContent = 'Enable Push Messages';
                        });
                    }).catch(function (e) {
                        console.error('Error thrown while unsubscribing from push messaging.', e);
                    });
            });
        }
        _this.initialiseState = function () {
            initialiseState();
        }

        _this.init = function (resouceName) {
            // this.worker = new Worker(_this.resouces[resouceName]);
            // navigator.serviceWorker.register(_this.resouces[resouceName]);
            // navigator.serviceWorker.ready
            //     .then(function (registration) {
            //         return registration.pushManager.subscribe({ userVisibleOnly: true });
            //     })
            //     .then(function (subscription) {
            //         console.log(subscription)
            //         console.log(`GCM EndPoint is: ${subscription.endpoint}`);
            //     })
            //     .catch(console.error.bind(console));
        };
        _this.postMessage = function (data) {
            // var d = $q.defer();
            // this.worker.postMessage(data);
            // this.worker.addEventListener('message', function (e) {
            //     d.resolve(e.data);
            // }, false);
            // return d.promise;
        };
        return _this;
    });

