import { AppVersion } from 'ionic-native';
import { Component } from '@angular/core';
import { AlertController, App, NavController } from 'ionic-angular';
import { AuthenticationService } from '../../../providers/authentication-service/authentication-service';
import { LoginPage } from '../../login/login'

@Component({
  templateUrl: 'about.html'
})
export class AboutPage {
  private versionNumber: string;

  constructor(private navCtrl: NavController,
    private app: App,
    private authenticationService: AuthenticationService,
    private alertCtrl: AlertController) {
    AppVersion.getVersionNumber().then(versionNumber => {
      this.versionNumber = versionNumber;
    })
      .catch(error => console.log(error));
  }

  private logout() {
    this.authenticationService.logout().then(() => {
      this.app.getRootNav().setRoot(LoginPage);
    })
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.logout();
          }
        },
        {
          text: 'No',
        }
      ]
    });
    confirm.present();
  }
}
