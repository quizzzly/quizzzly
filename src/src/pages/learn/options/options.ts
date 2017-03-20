import {Component} from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ILearnOptions } from '../iLearnOptions';

@Component({
  templateUrl: 'options.html'
})
export class LearnOptionsPage {
  private local: Storage;
  private options: ILearnOptions;
  public startWith;
  public initialValue;

  constructor(private viewCtrl: ViewController,
              private params: NavParams) {
    this.options = params.get('options');
    this.local = new Storage();

    if (this.options.showTerm) {
      this.startWith = 'term';
      this.initialValue = 'term';
    } else {
      this.startWith = 'definition';
      this.initialValue = 'definition';
    }
  }

  itemSelected(value) {
    if (value !== this.initialValue) {
      this.dismiss();
    }
  }

  dismiss() {
    this.options.showTerm = this.startWith === 'term';
    this.options.showDefinition = this.startWith === 'definition';
    this.local.set('learn-options', JSON.stringify(this.options));
    this.viewCtrl.dismiss(this.options);
  }
}
