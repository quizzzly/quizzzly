import { Injectable } from '@angular/core'
import { Network } from 'ionic-native';
import { Observable } from 'rxjs';
import { CommonConfiguration } from '../../config/config'

@Injectable()
export class NetworkStatusService {
  public networkStatusChanged: Observable<boolean>;

  constructor() {
    const disconect = Network.onDisconnect().map(() => false)
    const connect = Network.onConnect().map(() => true)

    const initialStatus = <Observable<boolean>>Observable.create((subscriber) => {
      // assume that for debug we always have intial connection
      const hasNetworkConnection = (
        Network.type !== 'none' &&
        Network.type !== 'unknown' &&
        Network.type !== null
      ) || CommonConfiguration.isDebug

      subscriber.next(hasNetworkConnection)
      subscriber.complete()
    })

    this.networkStatusChanged = Observable.merge(initialStatus, connect, disconect)
  }
}
