import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'options.html'
})
export class MatchOptionsPage {
  public maxTerms;
  public termsCount;
  private options;

  constructor(
    private viewCtrl: ViewController,
    private params: NavParams,
    private local: Storage
  ) {
    this.options = params.get('options');
    this.termsCount = this.options.termsCount;
    this.maxTerms = params.get('maxTerms');
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
