import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, App } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { MainPage } from '../pages/main/main';
import { LoginPage } from '../pages/login/login';
import { AuthenticationService } from '../providers/authentication-service/authentication-service';
import { initializeOfflineHttpService } from '../providers/offline-http-service/offline-http-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  private root: any;
  @ViewChild('navigation') navigation: NavController

  constructor(
    platform: Platform,
    authenticationService: AuthenticationService,
    appCtrl: App
  ) {
    initializeOfflineHttpService()

    Promise.all([
      authenticationService.isAuthenticated,
      platform.ready()
    ]).then(([isAuthenticated]) => {
        this.root = isAuthenticated ?
          MainPage :
          LoginPage

        StatusBar.styleDefault()
        Splashscreen.hide()
      })
  }
}
