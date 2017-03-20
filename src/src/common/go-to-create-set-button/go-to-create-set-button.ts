import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CreateSetPage } from '../../pages/create-set/create-set';
import { NetworkStatusService } from '../../providers/network-status-service/network-status-service'

@Component({
  selector: 'go-to-create-set-button',
  templateUrl: 'go-to-create-set-button.html',
})
export class GoToCreateSetButton {
  public hasNetworkConnection: boolean;

  constructor(
    private navCtrl: NavController,
    networkStatusService: NetworkStatusService
  ) {
    networkStatusService.networkStatusChanged.subscribe(hasConnection => this.hasNetworkConnection = hasConnection)
  }

  gotoCreateSet() {
    this.navCtrl.push(CreateSetPage);
  }
}
