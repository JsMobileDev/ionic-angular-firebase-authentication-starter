import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserProfile } from 'src/app/models/user';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public userProfile: UserProfile;
  constructor(
    private authService: AuthService,
    private router: Router,
    private profileService: ProfileService,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    this.userProfile = await this.profileService.getUserProfile();
  }

  async logOut(): Promise<void> {
    await this.authService.logout();
    this.router.navigateByUrl('login');
  }

  async updateName(): Promise<void> {
    const alert = await this.alertCtrl.create({
      subHeader: 'Your name',
      inputs: [
        {
          type: 'text',
          name: 'fullName',
          placeholder: 'Your full name',
          value: this.userProfile.fullName,
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
            this.profileService
              .updateEmail(data.newEmail, data.password)
              .then(() => {
                console.log('Email Changed Successfully');
              })
              .catch(error => {
                console.log('ERROR: ' + error.message);
              });
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
