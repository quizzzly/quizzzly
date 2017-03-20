import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, ViewController, AlertController } from 'ionic-angular';
import { TestConfiguration, Set, TermDefinition, TestStepValidationResult } from '../../../models/models';
import { Multiple } from './multiple/multiple';
import { TrueFalse } from './true-false/true-false';
import { Written } from './written/written';
import { TestResultsPage } from '../test-results/test-results';

const questionTypeValues = {
  trueFalse: 'true/false',
  written: 'written',
  multipleChoises: 'multipleChoises'
};

// const questionTypes = [questionTypeValues.trueFalse, questionTypeValues.written, questionTypeValues.multipleChoises];

@Component({
  templateUrl: 'test.html'
})
export class TestPage {
  get completedPercentage() {
    return Math.round((this.currentQuestionNumber / this.testConfiguration.questionsCount) * 100);
  }

  @ViewChild(Multiple) multiple: Multiple;
  @ViewChild(TrueFalse) trueFalse: TrueFalse;
  @ViewChild(Written) written: Written;

  currentQuestionNumber: number;
  currentQuestionType: string;
  currentTerm: TermDefinition;
  disableNextButton: boolean;

  get terms() {
    return this.set.terms;
  }
  get currentComponent(): any {

    if (this.currentQuestionType === questionTypeValues.trueFalse) {
      return this.trueFalse;
    }

    if (this.currentQuestionType === questionTypeValues.written) {
      return this.written;
    }

    if (this.currentQuestionType === questionTypeValues.multipleChoises) {
      return this.multiple;
    }

    return null;
  }

  private testConfiguration: TestConfiguration;
  private set: Set;
  private alreadyUsedTerms: Array<number>;
  private isFirstTap: boolean;
  private testResults: Array<TestStepValidationResult>;
  private questionTypes: Array<string>;

  constructor(private navCtrl: NavController,
    private viewCtrl: ViewController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    navParams: NavParams) {
    this.testConfiguration = navParams.data.testConfiguration;
    this.set = navParams.data.set;
    this.alreadyUsedTerms = [];
    this.testResults = [];
    this.currentQuestionNumber = 0;
    this.disableNextButton = true;
    this.initQuestionTypes();
  }

  private initQuestionTypes() {
    this.questionTypes = [];

    if (this.testConfiguration.isWritten) {
      this.questionTypes.push(questionTypeValues.written);
    }

    if (this.testConfiguration.isTrueFalse) {
      this.questionTypes.push(questionTypeValues.trueFalse);
    }

    if (this.testConfiguration.isMultipleChoices) {
      this.questionTypes.push(questionTypeValues.multipleChoises);
    }
  }

  ngOnInit() {
    this.initNextQuestion();
  }

  goNext() {
    if (this.isFirstTap) {
      this.isFirstTap = false;
      this.validate();
      if (this.testConfiguration.doInstantEvaluation) {
        this.currentComponent.showValidation();
        this.showToastMessage();
      } else {
        this.initNextQuestion();
      }
    } else {
      this.initNextQuestion();
    }
  }

  validate() {
    const validationResult = this.currentComponent.validate();
    this.testResults.push(validationResult);
  }

  updateNextButtonState(isDisabled) {
    this.disableNextButton = isDisabled;
  }

  private showToastMessage() {
    const lastValidationResult = this.testResults[this.testResults.length - 1];
    const message = lastValidationResult.isValid ? 'Correct' : 'Incorrect';
    // const cssClass = lastValidationResult.isValid ? 'test__toast-message--valid' : 'test__toast-message--invalid';
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top',
      showCloseButton: true
    });
    toast.present();
  }

  goBack() {
    let alert = this.alertCtrl.create({
      title: 'Confirm navigation',
      message: 'Do you really want to leave a test?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            alert.dismiss();
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });

    alert.present();
  }

  private initNextQuestion() {
    if (this.testConfiguration.questionsCount === this.currentQuestionNumber) {
      this.gotoTestResultPage();
      return;
    }

    this.selectNextRandomTerm();
    this.selectNextRandomQuestionType();
    this.isFirstTap = true;
    this.currentQuestionNumber++;
  }

  private gotoTestResultPage() {
    this.navCtrl.push(TestResultsPage, {
      testResults: this.testResults
    }).then(() => {
      const index = this.viewCtrl.index;
      const testSetupIndex = index - 1;
      this.navCtrl.remove(index);
      this.navCtrl.remove(testSetupIndex);
    });
  }

  private selectNextRandomTerm() {
    let index = this.getRandomTermItemIndex();
    this.currentTerm = this.terms[index];
    this.alreadyUsedTerms.push(index);
  }

  private getRandomTermItemIndex() {
    let index = 0;

    do {
      index = this.getRandomArrayIndex(this.terms);
    }
    while (this.alreadyUsedTerms.indexOf(index) !== -1);

    return index;
  }

  private getRandomArrayIndex(array: Array<any>) {
    return Math.floor(Math.random() * array.length);
  }

  private selectNextRandomQuestionType() {
    const index = this.getRandomArrayIndex(this.questionTypes);
    this.currentQuestionType = this.questionTypes[index];
    const currentComponent = this.currentComponent;

    if (currentComponent) {
      currentComponent.init(this.currentTerm, this.terms);
    }
  }
}
