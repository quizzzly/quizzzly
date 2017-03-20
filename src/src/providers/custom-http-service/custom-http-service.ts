import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { Http, Response, RequestOptionsArgs, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { AuthenticationService } from '../authentication-service/authentication-service';
import { AuthenticatedUserInfo } from '../../models/models';
import { OfflineHttpService } from '../offline-http-service/offline-http-service'

@Injectable()
export class CustomHttpService {
  private userInfoPromise: Promise<AuthenticatedUserInfo>;

  constructor(private http: Http,
    private toastController: ToastController,
    private offlineHttpService: OfflineHttpService,
    authenticationService: AuthenticationService
  ) {
    this.userInfoPromise = authenticationService.getUserInfoPromise();
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    let requestCallback = requestOptionArgs => {
      return this.offlineHttpService.loadWithCache(url, this.http.get(url, requestOptionArgs));
    };

    return this.executeWithRequestParameters(requestCallback, options);
  }

  post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    let requestCallback = requestOptionArgs => {
      return this.http.post(url, body, requestOptionArgs);
    };

    return this.executeWithRequestParameters(requestCallback, options);
  }

  put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    let requestCallback = requestOptionArgs => {
      return this.http.put(url, body, requestOptionArgs);
    };

    return this.executeWithRequestParameters(requestCallback, options);
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    let requestCallback = requestOptionArgs => this.http.delete(url, requestOptionArgs);

    return this.executeWithRequestParameters(requestCallback, options);
  }

  private executeWithRequestParameters(
    requestCallback: (RequestOptionsArgs) => Observable<Response>,
    options?: RequestOptionsArgs
  ) {
    let requestOptionArgsObservable = this.getRequestOptionArgs(options);

    return requestOptionArgsObservable.flatMap(requestCallback).retryWhen((error) => {
      let thatObserver = null
      let toast = null

      const observable = Observable.create(observer => {
        thatObserver = observer
      })

      error.throttleTime(1000).subscribe((e) => {
        if (toast) {
          toast.dismiss()
        }

        toast = this.showToastMessage(thatObserver)
      })

      return observable
    });
  }

  private showToastMessage(observer) {
    const toast = this.toastController.create({
      message: 'It was error during your request.',
      showCloseButton: true,
      closeButtonText: 'Retry',
      position: 'bottom',
      dismissOnPageChange: true,
      duration: 5000
    });

    toast.present();

    toast.onDidDismiss(() => {
      observer.next(true)
    });

    return toast
  }

  private getRequestOptionArgs(options?: RequestOptionsArgs): Observable<RequestOptionsArgs> {
    if (options == null) {
      options = new RequestOptions();
    }

    if (options.headers == null) {
      options.headers = new Headers();
    }

    options.headers.append('Access-Control-Allow-Credentials', 'true');

    let requestOptionsPromise = this.addAuthenticationInfo(options);
    return Observable.fromPromise(requestOptionsPromise);
  }

  private addAuthenticationInfo(options: RequestOptionsArgs): Promise<RequestOptionsArgs> {
    return this.userInfoPromise.then(userInfo => {
      options.headers.append('Authorization', `Bearer ${userInfo.access_token}`);
      return options;
    });
  }
}
