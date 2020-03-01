import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

exports.sendPushNotification = functions.firestore
  .document('notifications/{notificationId}')
  .onCreate(
    (
      snap: FirebaseFirestore.DocumentSnapshot,
      context: functions.EventContext
    ) => {
      const pushNotification = snap.data()!;

      const payload: any = {
        token: pushNotification.token,
        notification: {
          title: pushNotification.title,
          body: pushNotification.description
        },
        webpush: {
          fcmOptions: {
            link: 'https://myCoolApp.com/path_to_notification'
          },
          fcm_options: {
            link: 'https://myCoolApp.com/path_to_notification'
          }
        }
      };
      return admin.messaging().send(payload);
    }
  );
