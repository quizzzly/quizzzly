import { Injectable } from '@angular/core';
import { CustomHttpService } from '../custom-http-service/custom-http-service';
import { SerializationService } from '../serialization-service/serialization-service';
import { AuthenticationService } from '../authentication-service/authentication-service';
import { ApiConfiguration } from '../../config/config';
import { Observable } from 'rxjs';
import { Set, TermDefinition, AuthenticatedUserInfo } from '../../models/models';
import 'rxjs/add/operator/map';

@Injectable()
export class SetService {
  private userInfoObservable: Observable<AuthenticatedUserInfo>;

  constructor(private http: CustomHttpService,
    private serializer: SerializationService,
    authenticationService: AuthenticationService) {
    this.userInfoObservable = authenticationService.getUserInfoObservable();
  }

  getSets(): Observable<Array<Set>> {
    return this.userInfoObservable.flatMap(userInfo => {
      return this.http.get(ApiConfiguration.getSetsUrl(userInfo.user_id))
        .map(response => {
          return this.serializer.deserializeFromResponse<Array<Set>>(response);
        });
    })
  }

  getSetsByClassId(classId: number): Observable<Array<Set>> {
    return this.http.get(ApiConfiguration.getClassSetsUrl(classId))
      .map(response => {
        return this.serializer.deserializeFromResponse<Array<Set>>(response);
      });
  }

  getSet(setId: number): Observable<Set> {
    return this.http.get(ApiConfiguration.getSetUrl(setId))
      .map(response => {
        return this.serializer.deserializeFromResponse<Set>(response);
      });
  }

  getSetTerms(setId: number): Observable<Array<TermDefinition>> {
    return this.http.get(ApiConfiguration.getSetTermsUrl(setId))
      .map(response => {
        return this.serializer.deserializeFromResponse<Array<TermDefinition>>(response);
      });
  }

  create(set: Set): Observable<any> {
    let mappedSet = this.mapToCreationalForm(set);
    let serializedSet = this.serializer.serialize(mappedSet);
    return this.http.post(ApiConfiguration.createSetUrl, serializedSet);
  }

  update(set: Set): Observable<any> {
    let mappedSet = this.mapToCreationalForm(set);
    let serializedSet = this.serializer.serialize(mappedSet);
    let setId = set.id;
    return this.http.put(ApiConfiguration.getUpdateSetUrl(setId), serializedSet);
  }

  private mapToCreationalForm(set: Set): any {
    return {
      title: set.title,
      description: set.description,
      terms: set.terms.map(term => term.term),
      definitions: set.terms.map(term => term.definition),
      visibility: set.visibility,
      lang_terms: set.lang_terms,
      lang_definitions: set.lang_definitions,
      editable: set.editable
    };
  }
}
