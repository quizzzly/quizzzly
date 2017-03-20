import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Set } from '../../models/models';
import { SetPage } from '../../pages/set/set';

@Component({
  selector: 'set-list',
  templateUrl: 'set-list.html'
})
export class SetList {
  @Input() sets: Array<Set>;
  @Input() isInitialLoadingInProgress: boolean;

  get showListAdditionalComponent(): boolean {
    return this.isInitialLoadingInProgress || this.showEmptyListMessage;
  }

  get showEmptyListMessage(): boolean {
    return !this.isInitialLoadingInProgress && this.hasNoSets;
  }

  get hasNoSets(): boolean {
    return !this.sets || this.sets.length === 0;;
  }

  constructor(private navCtrl: NavController) {
  }

  onSetClick(set: Set): void {
    this.navCtrl.push(SetPage, set);
  }
}
