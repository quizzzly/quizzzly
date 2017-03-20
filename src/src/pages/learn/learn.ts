import { Component } from '@angular/core';
import { ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Set, TermDefinition } from '../../models/models';
import { LearnResultsPage } from './results/learnResults';
import { areTheSameValues } from '../../shared/termUtils';
import { LearnOptionsPage } from './options/options';
import { ILearnOptions } from './iLearnOptions';

import * as _ from 'lodash';

@Component({
  templateUrl: 'learn.html'
})
export class LearnPage {
  private currentCard: TermDefinition;
  private currentCardId = 0;
  private currentTerms = [];
  private set: Set;
  public score = {
    correct: 0,
    incorrect: 0,
    remaining: 0,
    total: 0
  };
  public isShowingDefinition = true;
  public isShowingCorrectAnswer = false;
  public isShowingWrongAnswer = false;
  public isShowingCopyAnswer = false;

  private local: Storage;
  private options: ILearnOptions = { showTerm: false, showDefinition: true };

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private viewCtrl: ViewController) {
    this.set = navParams.data;
    this.currentTerms = _.shuffle(this.set.terms)
    this.currentCard = this.currentTerms[this.currentCardId];
    this.score.remaining = this.currentTerms.length;
    this.score.total = this.currentTerms.length;

    this.local = new Storage();
    this.local.get('learn-options').then(value => {
      if (value) {
        this.options = JSON.parse(value);
      } else {
        this.local.set('learn-options', JSON.stringify(this.options));
      }
    });
  }

  public checkDublicateInput(value: string) {
    const valueToCheck = this.options.showDefinition ?
      this.currentCard.term :
      this.currentCard.definition;

    if (valueToCheck.toLowerCase() === value.toLowerCase()) {
      this.goToNextDefinition();
    }
  }

  private checkInput(value: string) {
    const valueToCheck = this.options.showDefinition ?
      this.currentCard.term :
      this.currentCard.definition;

    if (areTheSameValues(valueToCheck, value)) {
      this.score.correct++;
      this.showCorrectMessage();
    } else if (!value) {
      this.score.incorrect++;
      this.showInputToFillIn();
    } else {
      this.score.incorrect++;
      this.showCorrectAnswer();
    }

    this.score.remaining--;
  }

  private showInputToFillIn() {
    this.isShowingDefinition = false;
    this.isShowingCopyAnswer = true;
  }

  private showCorrectMessage() {
    this.isShowingDefinition = false;
    this.isShowingCorrectAnswer = true;
  }

  private showCorrectAnswer() {
    this.isShowingDefinition = false;
    this.isShowingWrongAnswer = true;
  }

  private goToNextDefinition() {
    this.showNext();
    this.hideAnswerTypes();
  }

  private hideAnswerTypes() {
    this.isShowingDefinition = true;
    this.isShowingCorrectAnswer = false;
    this.isShowingCopyAnswer = false;
    this.isShowingWrongAnswer = false;
  }

  showNext() {
    if (!this.score.remaining) {
      this.showIntermidiateResultsPage();
      return;
    }

    this.currentCard = this.currentTerms[++this.currentCardId];
  }

  public skipItem() {
    this.checkInput('');
  }

  private showIntermidiateResultsPage() {
    this.navCtrl.push(LearnResultsPage, {
      set: this.set,
      score: this.score
    }).then(() => {
      const index = this.viewCtrl.index;
      this.navCtrl.remove(index);
    });
  }

  public showOptionsPromt() {
    const modal = this.modalCtrl.create(LearnOptionsPage, {
      options: this.options
    });
    modal.present(modal);
    modal.onDidDismiss(options => {
      if (options) {
        this.options = options;
      }
    });
  }
}
