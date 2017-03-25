import { Injectable } from '@angular/core'
import { Network } from '@ionic-native/network'
import { Observable } from 'rxjs';
import { CommonConfiguration } from '../../config/config'

@Injectable()
export class NetworkStatusService {
  public networkStatusChanged: Observable<boolean>;

  constructor(
    network: Network
  ) {
    const disconect = network.onDisconnect().map(() => false)
    const connect = network.onConnect().map(() => true)

    const initialStatus = <Observable<boolean>>Observable.create((subscriber) => {
      // assume that for debug we always have intial connection
      const hasNetworkConnection = (
        network.type !== 'none' &&
        network.type !== 'unknown' &&
        network.type !== null
      ) || CommonConfiguration.isDebug

      subscriber.next(hasNetworkConnection)
      subscriber.complete()
    })

    this.networkStatusChanged = Observable.merge(initialStatus, connect, disconect)
  }
}
