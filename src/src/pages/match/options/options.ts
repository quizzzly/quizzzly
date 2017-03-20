import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'options.html'
})
export class MatchOptionsPage {
  public maxTerms;
  public termsCount;
  private local: Storage;
  private options;

  constructor(private viewCtrl: ViewController,
              private params: NavParams) {
    this.options = params.get('options');
    this.termsCount = this.options.termsCount;
    this.maxTerms = params.get('maxTerms');
    this.local = new Storage();
  }

  update() {
    this.local.set('match-options', JSON.stringify({
      termsCount: this.termsCount
    }));

    this.viewCtrl.dismiss({
      termsCount: this.termsCount
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
