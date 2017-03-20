import { Injectable } from '@angular/core'
import { Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { CommonConfiguration } from '../../config/config.ts';
import localForage from "localforage";

@Injectable()
export class OfflineHttpService {
  loadWithCache(key: string, observable: Observable<Response>): Observable<Response> {
    return observable
      .do(response => localForage.setItem(key, response))
      .catch(error => getFromStorage(key))
  }

  cleanCache() {
    return Observable
      .from(localForage.clear())
  }
}

const parseReponse = (response: any): Response => {
  const responseOptions = new ResponseOptions({
    body: response._body,
    status: response.status,
    headers: response.headers,
    statusText: response.statusText,
    type: response.type,
    url: response.url
  })

  return new Response(responseOptions)
}

const getFromStorage = (key: string): Observable<Response> => {
  const promise = localForage.getItem(key).then(item => {
    if (item === null) {
      throw 'No item found';
    }

    return parseReponse(item);
  })

  return Observable.fromPromise(<Promise<Response>>promise)
}

export const initializeOfflineHttpService = () => {
  localForage.config({
    name: 'offline-quizlet'
  })
}

