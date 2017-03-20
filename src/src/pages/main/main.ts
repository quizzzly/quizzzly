import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { ClassesPage } from '../classes/classes';
import { LatestPage } from '../latest/latest';
import { SetsPage } from '../sets/sets';
import { SettingsPage } from '../settings/settings';

@Component({
  templateUrl: 'main.html',
  selector: 'main'
})
export class MainPage {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LatestPage;
  pages: Array<{ title: string, component: any }>;

  constructor(
    public platform: Platform,
    public menu: MenuController
  ) {

    // set our app's pages
    this.pages = [
      { title: 'Latest', component: LatestPage },
      { title: 'Sets', component: SetsPage },
      { title: 'Classes', component: ClassesPage },
      { title: 'Settings', component: SettingsPage },
    ];
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
