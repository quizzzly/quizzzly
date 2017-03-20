import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { LearnPage } from '../learn';
import { Set } from '../../../models/models';

@Component({
  templateUrl: 'learnResults.html'
})
export class LearnResultsPage {
  set: Set;
  score: any;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private viewCtrl: ViewController) {
    this.set = navParams.data.set;
    this.score = navParams.data.score;
  }

  public gotoLearnPage() {
    this.navCtrl.push(LearnPage, this.set).then(() => {
      const index = this.viewCtrl.index;
      this.navCtrl.remove(index);
    });
  }
}
