import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { PushNotificationsService } from './services/push-notifications.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private swUpdate: SwUpdate,
    private pushNotificationService: PushNotificationsService
  ) {
    this.initializeApp();
  }

  initializeApp(): void {
    if (this.swUpdate.available) {
      this.swUpdate.available.subscribe(() => {
        if (confirm('A new version is available. Load it?'))
          window.location.reload();
      });
    }
    this.pushNotificationService.requestPermission();
    this.pushNotificationService.receiveMessage();
  }
}
