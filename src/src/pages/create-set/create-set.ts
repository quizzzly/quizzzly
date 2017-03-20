import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading, AlertController } from 'ionic-angular';
import { SetService } from '../../providers/set-service/set-service';
import { LanguageService } from '../../providers/language-service/language-service';
import { NetworkStatusService } from '../../providers/network-status-service/network-status-service'
import { SetVisibility, Set, TermDefinition } from '../../models/models';
import { Observable } from 'rxjs';

@Component({
  templateUrl: 'create-set.html'
})
export class CreateSetPage {
  title: string;
  selectedTermLanguage: string;
  selectedDefinitionLanguage: string;
  visibility: SetVisibility;
  terms: Array<{ term: string, definition: string }>;
  languageCodeValues: Array<string>;
  networkAvailable: boolean;

  public allowedVisibilities = [
    {
      title: 'Everyone',
      value: 'public'
    },
    {
      title: 'Only me',
      value: 'only_me'
    }
  ];
  private set: Set;
  private isEditMode: boolean;
  private loading: Loading;

  private static defaultLanguageCode = 'en';

  constructor(private navCtrl: NavController,
              private setService: SetService,
              private languageService: LanguageService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              networkStatusService: NetworkStatusService,
              navParams: NavParams
  ) {
    networkStatusService.networkStatusChanged.subscribe(isNetworkAvailable => this.networkAvailable = isNetworkAvailable)
    this.set = navParams.data.set;
    this.isEditMode = !!this.set;
  }

  ngOnInit() {
    this.initTitle();
    this.initLanguageCodes();
    this.initVisibility();
    this.initTerms();

    if (!this.set) {
      this.set = new Set();
    }
  }

  private initTitle() {
    this.title = this.isEditMode ? this.set.title : '';
  }

  private initLanguageCodes() {
    let defaultLanguage = this.languageService.findLanguageCodeByKey(CreateSetPage.defaultLanguageCode);
    let termLanguage = this.isEditMode ? this.languageService.findLanguageCodeByKey(this.set.lang_terms) : defaultLanguage;
    let definitionLanguage = this.isEditMode ? this.languageService.findLanguageCodeByKey(this.set.lang_definitions) : defaultLanguage;
    this.languageCodeValues = this.languageService.getLanguageCodeValues;
    this.selectedTermLanguage = termLanguage;
    this.selectedDefinitionLanguage = definitionLanguage;
  }

  private initVisibility() {
    let visibility = this.isEditMode ? this.set.visibility : this.allowedVisibilities[0].value;
    this.visibility = <SetVisibility>visibility;
  }

  private initTerms() {
    let firstTempTerm = { term: '', definition: '' };
    let secondTempTerm = { term: '', definition: '' };
    let tempTerms = [firstTempTerm, secondTempTerm];
    this.terms = this.isEditMode ? this.set.terms
                                 : tempTerms;
  }

  saveSet() {
    if (this.hasErrors()) {
      return;
    }

    this.updateSet();

    this.showUpdatingDialog();

    let observable = this.isEditMode ? this.setService.update(this.set) : this.setService.create(this.set);
    this.subscribeOnComplete(observable);
  }

  private subscribeOnComplete(observable: Observable<any>) {
    const that = this
    const subscriber = {
      next() {
        let navigationParams = new NavParams();
        navigationParams.data = this.set;
        this.navCtrl.pop(navigationParams);
      },
      error(error) {
        console.log(error)
      },
      finish() {
        that.hideUpdatingDialog();
      }
    }

    observable.subscribe(subscriber)
  }

  private showUpdatingDialog() {
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Loading new content. Please Wait...'
    });
    this.loading.present();
  }

  private hideUpdatingDialog() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }

  private updateSet() {
    this.set.title = this.title;
    this.set.lang_terms = this.languageService.findLanguageCodeByValue(this.selectedTermLanguage);
    this.set.lang_definitions = this.languageService.findLanguageCodeByValue(this.selectedDefinitionLanguage);
    this.set.visibility = this.visibility;
    this.set.terms = this.terms.map(term => {
      let termDefinition = new TermDefinition();
      termDefinition.term = term.term;
      termDefinition.definition = term.definition;

      return termDefinition;
    });
  }

  private hasErrors(): boolean {
    if (!this.title) {
      this.showValidationError('Add a title to finish creating your set');
      return true;
    }

    if (this.terms.length < 2) {
      this.showValidationError('You must fill in two terms and definitions to save your set');
      return true;
    }

    let notFilledTerms = this.terms.filter(term => { return !term.term || !term.definition; })

    if (notFilledTerms.length > 0) {
      this.showValidationError('You have some unfilled terms or definitions');
      return true;
    }

    return false;
  }

  private showValidationError(message: string) {
    let alert = this.alertCtrl.create({
      title: message,
      buttons: ['Ok']
    });
    alert.present();
  }

  addTerm() {
    this.terms.push({ term: '', definition: '' });
  }

  deleteTerm() {
    this.terms.pop();
  }
}
