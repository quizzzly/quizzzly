import { Component, OnDestroy } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { CardsPage } from '../cards/cards';
import { MatchPage } from '../match/match';
import { LearnPage } from '../learn/learn';
import { TestSetupPage } from '../test/test-setup/test-setup';
import { CreateSetPage } from '../create-set/create-set';
import { Set, StudySession } from '../../models/models';
import { SetService } from '../../providers/set-service/set-service';
import { AuthenticationService } from '../../providers/authentication-service/authentication-service';

@Component({
  templateUrl: 'set.html'
})
export class SetPage implements OnDestroy {
  set: Set;
  isLoadingTerms: boolean;
  canEditSet: boolean;
  private viewWillEnterSubscriber: any;

  constructor(private navCtrl: NavController,
    private setService: SetService,
    private authenticationService: AuthenticationService) {

    this.viewWillEnterSubscriber = this.navCtrl.viewWillEnter.subscribe((viewController: ViewController) => {
      if (viewController.instance instanceof SetPage) {
        let set = viewController.data;
        this.updateSetData(set);
        this.initiateEditRules();
      }
    });
  }

  private initiateEditRules() {
    this.canEditSet = false;
    this.authenticationService.getUserInfoPromise().then(userInfo => {
      this.canEditSet = this.set.editable === 'classes' ||
        (this.set.editable === 'only_me' && this.set.created_by === userInfo.user_id)
    });
  }

  ngOnDestroy() {
    this.viewWillEnterSubscriber.unsubscribe();
  }

  private updateSetData(set: Set) {
    const that = this;
    this.set = set;
    this.isLoadingTerms = true;

    this.setService.getSetTerms(this.set.id).subscribe({
      next: terms => this.set.terms = terms,
      error: () => {
        that.isLoadingTerms = false
      },
      complete: () => {
        that.isLoadingTerms = false
      }
    });
  }

  public gotoSessionSetPage(session: StudySession) {
    this.navCtrl.push(SetPage, session.set);
  }

  public gotoMatchPage() {
    this.navCtrl.push(MatchPage, this.set);
  }

  public gotoCardsPage() {
    this.navCtrl.push(CardsPage, this.set);
  }

  public gotoLearnPage() {
    this.navCtrl.push(LearnPage, this.set);
  }

  public gotoTestPage() {
    this.navCtrl.push(TestSetupPage, { set: this.set })
  }

  editSet() {
    this.navCtrl.push(CreateSetPage, { set: this.set });
  }
}
