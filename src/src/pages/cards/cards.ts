import { Component, ViewChild  } from '@angular/core';
import { ModalController, NavController, NavParams, Slides } from 'ionic-angular';
import { Storage  } from '@ionic/storage';
import { Set } from '../../models/models';
import { CardsOptionsPage } from './options/options';
import { ICardsOptions } from './iCardsOptions';
import * as _ from 'lodash';

@Component({
  templateUrl: 'cards.html'
})
export class CardsPage {
  @ViewChild('slider') slider: Slides;

  public currentCards = [];
  public hasNext: boolean = true;
  public hasPrev: boolean = false;
  private local: Storage;
  public showTerm: boolean;
  public showDefinition: boolean;
  private options: ICardsOptions = {showTerm: true, showDefinition: false};
  private set: Set;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private modalCtrl: ModalController) {
    this.set = navParams.data;
    this.currentCards = _.shuffle(this.set.terms);
    this.hasNext = this.currentCards.length > 1;

    this.local = new Storage();
    this.local.get('cards-options').then(value => {
      if (value) {
        this.options = JSON.parse(value);
      } else {
        this.local.set('cards-options', JSON.stringify(this.options));
      }
      this.showTerm = this.options.showTerm;
      this.showDefinition = this.options.showDefinition;
    });
  }

  private setVisibilityToDefaultValues() {
    this.showTerm = this.options.showTerm;
    this.showDefinition = this.options.showDefinition;
    this.hasNext = !this.slider.isEnd();
    this.hasPrev = !this.slider.isBeginning();
  }

  showOptionsPromt() {
    const modal = this.modalCtrl.create(CardsOptionsPage, {
      options: this.options
    });
    modal.present(modal);
    modal.onDidDismiss(options => {
      if (options) {
        this.options = options;
      }
      this.setVisibilityToDefaultValues();
    });
  }

  showNext() {
    this.slider.slideNext();
    this.setVisibilityToDefaultValues();
  }

  onSwiped() {
    this.setVisibilityToDefaultValues();
  }

  showPrev() {
    this.slider.slidePrev();
    this.setVisibilityToDefaultValues();
  }

  flipCard() {
    this.showTerm = !this.showTerm;
    this.showDefinition = !this.showDefinition;
  }
}
