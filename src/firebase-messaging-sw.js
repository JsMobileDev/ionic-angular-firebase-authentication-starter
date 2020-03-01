importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCATun5z-FQAmxngFUWl0dkG2zmcn587B0',
  authDomain: 'ionic-angular-event-manager.firebaseapp.com',
  databaseURL: 'https://ionic-angular-event-manager.firebaseio.com',
  projectId: 'ionic-angular-event-manager',
  storageBucket: 'ionic-angular-event-manager.appspot.com',
  messagingSenderId: '1055126399542',
  appId: '1:1055126399542:web:3c36a5c070d8fd78'
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/assets/icons/icon-72x72.png'
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
