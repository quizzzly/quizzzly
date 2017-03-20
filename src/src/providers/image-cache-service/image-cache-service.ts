import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Transfer, File } from 'ionic-native'
import { NetworkStatusService } from '../network-status-service/network-status-service'
import { CommonConfiguration } from '../../config/config'

Injectable()
export class ImageCacheService {
  private hasConnection: boolean

  constructor(
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
      loadFileFromNetwork(src) :
      resolveLocalFilesystemUrl(src)

    return observable
      .filter(src => !!src)
      .catch(() => [src])
  }

  cleanCachedImages() {
    const checkDirectoryExist = Observable.from(
      File.checkDir(
        getCordovaFileDirectory(),
        cacheImagesFolder
      )
    )

    const removeDirectory = Observable.from(
      File.removeRecursively(
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
  cordova && cordova.file && cordova.file.dataDirectory || ''

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
    .from(File.resolveLocalFilesystemUrl(getAppFolderPath() + getLocalFileName(src)))
    .map(entry => entry.toURL())

const loadFileFromNetwork = src =>
  Observable
    .from(new Transfer().download(src, getLocalFilePath(src)))
    .map(entry => entry.toURL())
