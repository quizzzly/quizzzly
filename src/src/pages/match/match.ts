import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Set, TermDefinition } from '../../models/models';
import { MatchOptionsPage } from './options/options';
import { MatchResultsPage } from './results/matchResults';
import * as _ from 'lodash';
import { Stopwatch } from '../../shared/stopwatch';
import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: 'match.html'
})
export class MatchPage implements OnInit, OnDestroy {
  public roundTime: string = '0.00';
  public terms: Array<any>;
  private items: Array<TermDefinition>;
  private local: Storage;
  private options = { termsCount: 6 };
  private previousTerm: any = {};
  private set: Set;
  private stopwatch: Stopwatch;
  private timerSubscriber: any;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private viewCtrl: ViewController,
              private modalCtrl: ModalController) {
    this.set = navParams.data;

    this.stopwatch = new Stopwatch();
    this.local = new Storage();
}

  ngOnInit() {
    this.local.get('match-options').then(value => {
      if (value) {
        this.options = JSON.parse(value);
      } else {
        this.local.set('match-options', JSON.stringify(this.options));
      }

      this.initializeMatch();
      this.stopwatch.start();

      this.timerSubscriber = Observable.interval(50).subscribe(() => {
          this.roundTime = this.stopwatch.getTime();
      });
    });
  }

  ngOnDestroy() {
    this.timerSubscriber.unsubscribe();
  }

  private initializeMatch(): void {
    this.items = this.getTermsToMatch();
    this.setTerms();
  }

  private getTermsToMatch(): Array<TermDefinition> {
    return _.sampleSize(this.set.terms, this.options.termsCount);
  }

  private setTerms(): void {
    const terms = this.getTerms();
    const definitions = this.getImagesWithDefinitions();
    this.terms = _.shuffle(terms.concat(definitions));
  }

  private getTerms(): Array<Object> {
    return this.items.map(term => {
      return {
        id: term.id,
        term: term.term,
        isTerm: true
      };
    });
  }

  private getImagesWithDefinitions(): Array<Object> {
    return this.items.map(term => _.omit(term, 'term'));
  }

  public pullToRefresh(refresher?): void {
    this.initializeMatch();
    refresher.complete();
    this.stopwatch.clear();
  }

  public pickItem(term: any): any {
    this.checkTerm(term);
  }

  public showOptionsPromt() {
    const modal = this.modalCtrl.create(MatchOptionsPage, {
      options: this.options,
      maxTerms: this.set.terms.length
    });
    modal.present(modal);
    modal.onDidDismiss(options => {
      if (options) {
        this.options = options;
        this.initializeMatch();
        this.stopwatch.clear();
      }
    });
  }

  private checkTerm(term: any): any {
    if (this.previousTerm.id === term.id &&
        this.previousTerm.isTerm !== term.isTerm) {
      this.removeTermsById(this.previousTerm.id);
      this.previousTerm = {};
      if (this.terms.length === 0) {
        this.displayResult();
      }
    } else {
      this.previousTerm = term;
    }
  }

  private removeTermsById(id: string): any {
    _.remove(this.terms, (term) => {
      return term.id === id;
    });
  }

  private displayResult() {
    this.gotoMatchResutsPage();
  }

  private gotoMatchResutsPage() {
    this.navCtrl.push(MatchResultsPage, {
      set: this.set,
      time: this.roundTime
    }).then(() => {
      const index = this.viewCtrl.index;
      this.navCtrl.remove(index);
    });
  }
}
