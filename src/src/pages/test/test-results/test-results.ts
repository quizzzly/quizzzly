import { Component } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { TestStepValidationResult } from '../../../models/models';

@Component({
  templateUrl: 'test-results.html',
})
export class TestResultsPage {
  testResults: Array<TestStepValidationResult>;
  get score() {
    const numberOfValidAnswers = this.testResults.filter(result => result.isValid).length;
    return Math.floor((numberOfValidAnswers / this.testResults.length) * 100);
  }
  constructor(private navCtrl: NavController,
    viewCtrl: ViewController,
    navParams: NavParams) {
      this.testResults = navParams.data.testResults;
  }
}
