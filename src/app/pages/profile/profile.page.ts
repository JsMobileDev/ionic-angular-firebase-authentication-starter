import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserProfile } from 'src/app/models/user';
import { ProfileService } from './profile.service';
import { Observable, Subscription } from 'rxjs';
import { first, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnDestroy {
  public userProfile: Observable<UserProfile> = this.profileService.getUserProfile();
  private userProfileSubscription: Subscription;
  constructor(
    private authService: AuthService,
    private router: Router,
    private profileService: ProfileService,
    private alertCtrl: AlertController
  ) {}

  ngOnDestroy(): void {
    this.userProfileSubscription?.unsubscribe();
  }

  async logOut(): Promise<void> {
    await this.authService.logout();
    this.router.navigateByUrl('login');
  }

  updateName(): void {
    this.userProfileSubscription = this.userProfile
      .pipe(
        first(),
        tap({
          next: async (userProfile: UserProfile) => {
            const alert = await this.alertCtrl.create({
              subHeader: 'Your name',
              inputs: [
                {
                  type: 'text',
                  name: 'fullName',
                  placeholder: 'Your full name',
                  value: userProfile.fullName,
                },
              ],
              buttons: [
                { text: 'Cancel' },
                {
                  text: 'Save',
                  handler: data => {
                    this.profileService.updateName(data.fullName);
                  },
                },
              ],
            });
            return await alert.present();
          },
          error: error => console.error(error),
        })
      )
      .subscribe();
  }

  async updateEmail(): Promise<void> {
    const alert = await this.alertCtrl.create({
      inputs: [
        { type: 'text', name: 'newEmail', placeholder: 'Your new email' },
        { name: 'password', placeholder: 'Your password', type: 'password' },
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileService.updateEmail(data.newEmail, data.password);
          },
        },
      ],
    });
    return await alert.present();
  }

  async updatePassword(): Promise<void> {
    const alert = await this.alertCtrl.create({
      inputs: [
        { name: 'newPassword', placeholder: 'New password', type: 'password' },
        { name: 'oldPassword', placeholder: 'Old password', type: 'password' },
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileService.updatePassword(data.newPassword, data.oldPassword);
          },
        },
      ],
    });
    return await alert.present();
  }
}
