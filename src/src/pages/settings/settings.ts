import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {TabsPage} from './tabs/tabs';

@Component({
  templateUrl: 'settings.html'
})
export class SettingsPage {
  public tabsPage: any;

  constructor(private navCtrl: NavController) {
    this.tabsPage = TabsPage;
  }
}
