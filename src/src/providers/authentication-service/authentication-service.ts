import { Injectable, Inject } from '@angular/core'
import { Http, URLSearchParams, Headers, RequestOptions } from '@angular/http'
import { AuthenticationConfiguration } from '../../config/config'
import { CommonConfiguration } from '../../config/config'
import { AuthenticatedUserInfo } from '../../models/models'
import { InAppBrowser } from '@ionic-native/in-app-browser'
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage'
import { Platform } from 'ionic-angular'
import { SerializationService } from '../serialization-service/serialization-service'
import { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operator/map'
import { fromPromise } from 'rxjs/Observable/fromPromise'

const LOCAL_STORAGE_KEY: string = 'user-token'
const APP_STORAGE_NAMESPACE: string = 'quzlet-app'
const ERROR_MESSAGE: string = 'Problem authenticating with Quizlet'

@Injectable()
export class AuthenticationService {
  private secureStorage: SecureStorage
  private platformReady: Promise<any>

  constructor(
    private http: Http,
    @Inject(SerializationService) private serializationService: SerializationService,
    platform: Platform,
    private inAppBrowser: InAppBrowser
  ) {
    this.platformReady = platform.ready()
    this.secureStorage = new SecureStorage()
  }

  getSecureStorage(): Promise<SecureStorageObject> {
    return this.platformReady.then(() => {
      return this.secureStorage.create(APP_STORAGE_NAMESPACE)
    })
  }

  get isAuthenticated(): Promise<boolean> {
    if (CommonConfiguration.isDebug) {
      return Promise.resolve(true)
    }

    return this.getSecureStorage().then((storage) => {
      return storage.get(LOCAL_STORAGE_KEY)
    }).then(userInfo => {
      console.log(userInfo)
      return !!userInfo
    }).catch((error) => {
      console.log(error, 'getSecureStorage')
      return Promise.resolve(false)
    })
  }

  authenticate(): Promise<AuthenticatedUserInfo> {
    if (CommonConfiguration.isDebug) {
      return this.authenticateLocal()
    }

    return this.authenticateRemote()
  }

  private authenticateRemote(): Promise<AuthenticatedUserInfo> {
    return new Promise((resolve, reject) => {
      let randomState = Math.random().toString(36).substr(2, 5)
      let browser = this.inAppBrowser.create(
        AuthenticationConfiguration.getAuthenticationUrl(randomState),
        "_blank",
        "location=no,clearsessioncache=yes,clearcache=yes"
      )

      let loadStart = browser.on('loadstart')
      let exit = browser.on('exit')

      let exitSubscription = exit.subscribe(event => {
        console.log(event, 'exit')
      })

      loadStart.subscribe(event => {
        if (!this.isRightCallbackUrl(event.url)) {
          return
        }

        exitSubscription.unsubscribe()
        browser.close()

        let responseParameters = this.getUrlParameters(event.url)

        if (this.hasAuthenticationErrors(responseParameters, randomState)) {
          reject(ERROR_MESSAGE)
        }

        let success = userInfo => {
          let userInfoBody = JSON.parse(userInfo['_body'])
          this.saveUserInfo(userInfoBody).then(userInfo => {
            console.log(`Logged with user ${userInfo.user_id}`)
            this.saveUserInfo(userInfo)
            resolve(userInfo)
          }).catch(error => {
            console.log(error, 'saveUserInfo in authenticateRemove')
          })
        }

        let code = this.exchangeTempCodeToUserInfo(responseParameters.get('code'))
        map.call(code, response => response.json())
        code.subscribe(success, reject)
      })
    })
  }

  private authenticateLocal(): Promise<AuthenticatedUserInfo> {
    console.log(`Using temp user ${JSON.stringify(CommonConfiguration.tempUser)}`)

    return Promise.resolve(CommonConfiguration.tempUser)
  }

  private saveUserInfo(userInfo: { access_token: string, user_id: string }): Promise<AuthenticatedUserInfo> {
    let authenticatedUserInfo = <AuthenticatedUserInfo>userInfo
    let serializedUserInfo = JSON.stringify(authenticatedUserInfo)

    return this.getSecureStorage().then((storage) => {
      return storage.set(LOCAL_STORAGE_KEY, serializedUserInfo)
    }).then((data) => {
      return Promise.resolve(authenticatedUserInfo)
    }).catch(error => {
      console.log(error, 'saveUserInfo')
      return Promise.reject('cannot save user' + error)
    })
  }

  private exchangeTempCodeToUserInfo(code: string): Observable<any> {
    let params = new URLSearchParams()
    params.set('grant_type', 'authorization_code')
    params.set('code', code)
    let clientAuthenticationHeader = this.createClientAuthenticationHeader()
    let headers = new Headers({
      'Authorization': clientAuthenticationHeader
    })
    let options = new RequestOptions({ headers: headers, search: params })

    return this.http.get(AuthenticationConfiguration.tokenBasedUrl, options)
  }

  private createClientAuthenticationHeader(): string {
    let token = `${AuthenticationConfiguration.clientId}:${AuthenticationConfiguration.clientSecret}`
    let encodedToken = btoa(token)

    return `Basic ${encodedToken}`
  }

  private isRightCallbackUrl(url: string) {
    return (url).indexOf(AuthenticationConfiguration.callBackUrl) === 0
  }

  private getUrlParameters(url: string): Map<any, any> {
    return url.split('?')[1]
      .split('&')
      .map(v => v.split('='))
      .reduce((map, [key, value]) => map.set(key, decodeURIComponent(value)), new Map())
  }

  private hasAuthenticationErrors(parameters: Map<any, any>, state: string): boolean {
    if (parameters.get('error')) {
      return true
    }

    if (parameters.get('state') !== state) {
      return true
    }

    return false
  }

  getUserInfoPromise(): Promise<AuthenticatedUserInfo> {
    if (CommonConfiguration.isDebug) {
      return this.authenticateLocal()
    }

    return this.getSecureStorage().then((storage) => {
      return storage.get(LOCAL_STORAGE_KEY)
    }).then((serializedUserInfo: any) => {
      return this.serializationService.deserialize<AuthenticatedUserInfo>(serializedUserInfo)
    }).catch(error => {
      console.log(error, 'getUserInfoPromise')
      return Promise.reject(error)
    })
  }

  getUserInfoObservable(): Observable<AuthenticatedUserInfo> {
    return fromPromise(this.getUserInfoPromise())
  }

  logout(): Promise<void> {
    return this.getSecureStorage().then((storage) => {
      return storage.remove(LOCAL_STORAGE_KEY)
    }).catch(error => {
      console.log(error, 'logout')
    })
  }
}

