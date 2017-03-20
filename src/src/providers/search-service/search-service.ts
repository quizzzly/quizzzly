import { Injectable } from '@angular/core';
import { CustomHttpService } from '../custom-http-service/custom-http-service';
import { ApiConfiguration } from '../../config/config';
import { SerializationService } from '../serialization-service/serialization-service';
import { SetSearchResults } from '../../models/models';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class SearchService {
  constructor(private http: CustomHttpService,
    private serializer: SerializationService) { }

  getSetSearchResults(query: string, page?: number): Observable<SetSearchResults> {
    const searchUrl = page ? ApiConfiguration.getNextPageSearchSetUrl(encodeURI(query), page) :
                             ApiConfiguration.getSearchSetUrl(encodeURI(query));
    return this.http.get(searchUrl)
      .map(response => {
        return this.serializer.deserializeFromResponse<SetSearchResults>(response);
      });
  }
}
