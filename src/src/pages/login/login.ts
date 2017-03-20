import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CommonConfiguration } from '../../config/config.ts';
import { MainPage } from '../main/main';
import { AuthenticationService } from '../../providers/authentication-service/authentication-service';
import { ToastController } from 'ionic-angular';

@Component({
  templateUrl: 'login.html',
  selector: 'login'
})
export class LoginPage {
  constructor(private navCtrl: NavController,
              private toastController: ToastController,
              private authenticationService: AuthenticationService) {
  }

  login(): void {
    this.authenticationService.authenticate()
      .then((userInfo) => {
        console.log(`Successfull login with user ${JSON.stringify(userInfo)}`);
        this.navCtrl.setRoot(MainPage);
      })
      .catch((error) => {
        this.toastController.create({
          message: error,
          duration: 3000
        });
      });
  }
}
