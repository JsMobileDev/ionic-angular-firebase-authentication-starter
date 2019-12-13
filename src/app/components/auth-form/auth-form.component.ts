import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserCredential } from 'src/app/models/user';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss']
})
export class AuthFormComponent implements OnInit {
  public loading: HTMLIonLoadingElement;
  public authForm: FormGroup;
  @Input() actionButtonText: string;
  @Input() isPasswordResetPage = false;
  @Output() formSubmitted = new EventEmitter<any>();

  constructor(
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    this.authForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.minLength(6)]
    });
  }

  ngOnInit() {}

  submitCredentials(authForm: FormGroup): void {
    if (!authForm.valid) {
      console.log('Form is not valid yet, current value:', authForm.value);
    } else {
      this.showLoading();
      const credentials: UserCredential = {
        email: authForm.value.email,
        password: authForm.value.password
      };
      this.formSubmitted.emit(credentials);
    }
  }

  async showLoading(): Promise<void> {
    try {
      this.loading = await this.loadingCtrl.create();
      await this.loading.present();
    } catch (error) {
      this.handleError(error);
    }
  }

  hideLoading(): Promise<boolean> {
    return this.loading.dismiss();
  }

  async handleError(error): Promise<void> {
    const alert = await this.alertCtrl.create({
      message: error.message,
      buttons: [{ text: 'Ok', role: 'cancel' }]
    });
    await alert.present();
  }
}
