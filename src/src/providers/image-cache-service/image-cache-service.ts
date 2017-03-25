import { Injectable, Inject } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { Transfer } from '@ionic-native/transfer'
import { File, Entry } from '@ionic-native/file'
import { NetworkStatusService } from '../network-status-service/network-status-service'
import { CommonConfiguration } from '../../config/config'

Injectable()
export class ImageCacheService {
  private hasConnection: boolean

  constructor(
    private file: File,
    private transfer: Transfer,
    @Inject(NetworkStatusService) networkStatusService: NetworkStatusService
  ) {
    networkStatusService
      .networkStatusChanged
      .subscribe(hasConnection => this.hasConnection = hasConnection)
  }

  loadWithCache(src: string): Observable<string> {
    if(CommonConfiguration.isDebug) {
      return Observable.from([src])
    }

    const observable = this.hasConnection ?
      loadFileFromNetwork(src, this.transfer) :
      resolveLocalFilesystemUrl(src)

    return observable
      .filter(src => !!src)
      .catch(() => [src])
  }

  cleanCachedImages() {
    const checkDirectoryExist = Observable.from(
      this.file.checkDir(
        getCordovaFileDirectory(),
        cacheImagesFolder
      )
    )

    const removeDirectory = Observable.from(
      this.file.removeRecursively(
        getCordovaFileDirectory(),
        cacheImagesFolder
      )
    )

    return checkDirectoryExist
      .mergeMap(() => removeDirectory)
      //No directory was found
      .catch(() => [])
  }
}

const cacheImagesFolder = 'quizlet-files'

declare var cordova: any;

const getCordovaFileDirectory = () =>
  cordova && cordova.file && cordova.this.file.dataDirectory || ''

const getAppFolderPath = () =>
  getCordovaFileDirectory() +
  cacheImagesFolder +
  '/'

const getLocalFilePath = src =>
  getAppFolderPath() + getLocalFileName(src)

const getLocalFileName = src => {
  const parts = src.split('/')
  //Handels case with trailing '/'
  return parts.pop() || parts.pop()
}

const resolveLocalFilesystemUrl = src =>
  Observable
    .from(this.file.resolveLocalFilesystemUrl(getAppFolderPath() + getLocalFileName(src)))
    .map(entry => (<Entry> entry).toURL())

const loadFileFromNetwork = (src, transfer) =>
  Observable
    .from(transfer.create().download(src, getLocalFilePath(src)))
    .map(entry => (<Entry> entry).toURL())
