import {Component} from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ICardsOptions } from '../iCardsOptions';

@Component({
  templateUrl: 'options.html'
})
export class CardsOptionsPage {
  private local: Storage;
  private options: ICardsOptions;
  public startWith;
  public initialValue;

  constructor(private viewCtrl: ViewController,
              private params: NavParams) {
    this.options = params.get('options');
    this.local = new Storage();

    if (this.options.showTerm) {
      if (this.options.showDefinition) {
        this.startWith = 'bothSides';
        this.initialValue = 'bothSides';
      } else {
        this.startWith = 'term';
        this.initialValue = 'term';
      }
    } else {
      this.initialValue = 'definition';
      this.startWith = 'definition';
    }
  }

  itemSelected(value) {
    if (value !== this.initialValue) {
      this.dismiss();
    }
  }

  dismiss() {
    this.options.showTerm = this.startWith === 'bothSides' ||
                            this.startWith === 'term';
    this.options.showDefinition = this.startWith === 'bothSides' ||
                                  this.startWith === 'definition';
    this.local.set('cards-options', JSON.stringify(this.options));
    this.viewCtrl.dismiss(this.options);
  }
}
