import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { QuizletClass } from '../../models/models';

@Component({
  templateUrl: 'quizlet-class.html'
})
export class QuizletClassPage {
  selectedSegment: 'sets' | 'members';
  quizletClass: QuizletClass;

  constructor(
    private navCtrl: NavController,
    params: NavParams
  ) {
    this.quizletClass = params.data.quizletClass;
    this.selectedSegment = 'sets';
  }
}
