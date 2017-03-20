import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { MatchPage } from '../match';
import { Set } from '../../../models/models';

@Component({
  templateUrl: 'matchResults.html'
})
export class MatchResultsPage {
  set: Set;
  time: string;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private viewCtrl: ViewController) {
    this.set = navParams.data.set;
    this.time = navParams.data.time;
  }

  public gotoMatchPage() {
    this.navCtrl.push(MatchPage, this.set).then(() => {
      const index = this.viewCtrl.index;
      this.navCtrl.remove(index);
    });
  }
}
