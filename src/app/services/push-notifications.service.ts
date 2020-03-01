import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import 'firebase/messaging';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {
  pushNotificationToken: string = null;
  constructor(private messaging: AngularFireMessaging) {}

  requestPermission() {
    this.messaging.requestToken.subscribe(
      token => {
        this.pushNotificationToken = token;
        console.log(token);
      },
      err => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }
  receiveMessage() {
    this.messaging.messages.subscribe((payload: any) => {
      console.log('new message received. ', payload);
      // window.location = payload.fcmOptions.link;
    });
  }
}
