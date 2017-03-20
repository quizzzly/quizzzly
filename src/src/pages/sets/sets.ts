import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Set } from '../../models/models';
import { SetService } from '../../providers/set-service/set-service';
import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: 'sets.html'
})
export class SetsPage {
  sets: Array<Set>;
  isInitialLoadingInProgress: boolean;

  constructor(
    private navCtrl: NavController,
    private setService: SetService
  ) {
    this.sets = null;
  }

  ngOnInit() {
    this.isInitialLoadingInProgress = true;
    const that = this;

    this.updateSets().subscribe({
      complete: () => that.isInitialLoadingInProgress = false
    });
  }

  updateSets(): Observable<Array<Set>> {
    const observable = this.setService.getSets().share();
    observable.subscribe(sets => this.sets = sets, () => this.sets = []);
    return observable;
  }

  pullToRefresh(refresher) {
    this.updateSets().subscribe(() => refresher.complete());
  }
}
