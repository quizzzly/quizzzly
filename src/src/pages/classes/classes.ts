import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { QuizletClass } from '../../models/models';
import { ClassService } from '../../providers/class-service/class-service';
import { QuizletClassPage } from '../quizlet-class/quizlet-class';
import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: 'classes.html'
})
export class ClassesPage {
  classes: Array<QuizletClass>;
  isInitialLoadingInProgress: boolean;

  get showListAdditionalComponent(): boolean {
    return this.isInitialLoadingInProgress || this.showEmptyListMessage;
  }

  get showEmptyListMessage(): boolean {
    return !this.isInitialLoadingInProgress &&
      this.classes !== null &&
      this.classes.length === 0;
  }

  constructor(private navCtrl: NavController,
    private classService: ClassService) {
  }

  ngOnInit() {
    this.isInitialLoadingInProgress = true;
    this.updateClasses().subscribe(() => {
      this.isInitialLoadingInProgress = false;
    }, () => { }, () => {
      this.isInitialLoadingInProgress = false;
    });
  }

  updateClasses(): Observable<any> {
    let observable = this.classService.getClasses().share();
    observable.subscribe(classes => {
      this.classes = classes;
    });
    return observable;
  }

  pullToRefresh(refresher) {
    this.updateClasses().subscribe(() => {
      refresher.complete();
    });
  }

  onClassClick(quizletClass: QuizletClass) {
    this.navCtrl.push(QuizletClassPage, { quizletClass });
  }
}
