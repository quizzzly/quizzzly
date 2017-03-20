import { Component } from '@angular/core';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { CachePage } from '../cache/cache';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  public aboutRoot: any;
  public cacheRoot: any;
  public contactRoot: any;

  public config = {
    isFromTabs: true
  }

  constructor() {
    this.contactRoot = ContactPage;
    this.aboutRoot = AboutPage;
    this.cacheRoot = CachePage;
  }
}
