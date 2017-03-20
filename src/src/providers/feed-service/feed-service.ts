import { Injectable } from '@angular/core';
import { URLSearchParams, RequestOptions } from '@angular/http';
import { CustomHttpService } from '../custom-http-service/custom-http-service';
import { SerializationService } from '../serialization-service/serialization-service';
import { ApiConfiguration } from '../../config/config';
import { Observable } from 'rxjs';
import { Feed } from '../../models/models';
import 'rxjs/add/operator/map';

@Injectable()
export class FeedService {
  constructor(private http: CustomHttpService,
    private serializer: SerializationService) {
  }

  get(loadedSofarFeed?: Feed): Observable<Feed> {
    let params = new URLSearchParams();

    if (loadedSofarFeed) {
      this.addSearchParameters(params, loadedSofarFeed);
    }

    let requestOptions = new RequestOptions({
      search: params
    });

    return this.http.get(ApiConfiguration.feedUrl, requestOptions)
      .map(response => {
        return this.serializer.deserializeFromResponse<Feed>(response)
      });
  }

  private addSearchParameters(params: URLSearchParams, loadedSofarFeed: Feed) {
    this.setSetIds(params, loadedSofarFeed);
    this.setMinimumTimestamp(params, loadedSofarFeed);
  }

  private setSetIds(params: URLSearchParams, loadedSofarFeed: Feed) {
    let setIds = loadedSofarFeed.items
      .map(item => item.set_ids)
      .join('.');

    params.set('seenSetIds', setIds);
  }

  private setMinimumTimestamp(params: URLSearchParams, loadedSofarFeed: Feed) {
    let minimumTimeStamp = loadedSofarFeed.items
      .map(item => item.timestamp)
      .reduce((prev, current) => {
        if (current < prev) {
          return current;
        }

        return prev;
      }, Number.MAX_VALUE);

    if (minimumTimeStamp === Number.MAX_VALUE) {
      return;
    }

    params.set('minTimestamp', minimumTimeStamp.toString());
  }
}

