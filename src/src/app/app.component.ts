import { Component, ViewChild } from '@angular/core'
import { Platform, NavController, App } from 'ionic-angular'
import { SplashScreen } from '@ionic-native/splash-screen'
import { StatusBar } from '@ionic-native/status-bar'
import { MainPage } from '../pages/main/main'
import { LoginPage } from '../pages/login/login'
import { AuthenticationService } from '../providers/authentication-service/authentication-service'
import { initializeOfflineHttpService } from '../providers/offline-http-service/offline-http-service'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  private root: any
  @ViewChild('navigation') navigation: NavController

  constructor(
    platform: Platform,
    authenticationService: AuthenticationService,
    splashScreen: SplashScreen,
    statusBar: StatusBar,
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

        statusBar.styleDefault()
        splashScreen.hide()
      })
  }
}
