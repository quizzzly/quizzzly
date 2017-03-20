import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Set, TestConfiguration } from '../../../models/models';
import { TestPage } from '../test/test';

@Component({
  templateUrl: 'test-setup.html',
})
export class TestSetupPage {
  set: Set;
  testConfiguration: TestConfiguration;
  get disableNext() {
    return !this.testConfiguration.isWritten && !this.testConfiguration.isTrueFalse && !this.testConfiguration.isMultipleChoices;
  }

  constructor(private navCtrl: NavController, navParams: NavParams) {
    this.set = navParams.data.set;
    this.testConfiguration = new TestConfiguration();
    this.testConfiguration.isWritten = true;
    this.testConfiguration.isTrueFalse = true;
    this.testConfiguration.isMultipleChoices = true;
    this.testConfiguration.doInstantEvaluation = true;
    this.testConfiguration.isStartWithDefinition = true;
    this.testConfiguration.questionsCount = this.set.terms.length;
  }

  public gotoTest() {
    this.navCtrl.push(TestPage, { set: this.set, testConfiguration: this.testConfiguration });
  }
}
