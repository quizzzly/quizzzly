import { Injectable } from '@angular/core';
import { CustomHttpService } from '../custom-http-service/custom-http-service';
import { AuthenticationService } from '../authentication-service/authentication-service';
import { SerializationService } from '../serialization-service/serialization-service';
import { AuthenticatedUserInfo, QuizletClass } from '../../models/models';
import { Observable } from 'rxjs';
import { ApiConfiguration } from '../../config/config';
import 'rxjs/add/operator/map';

@Injectable()
export class ClassService {
  private userInfoObservable: Observable<AuthenticatedUserInfo>;

  constructor(private http: CustomHttpService,
    private serializer: SerializationService,
    authenticationService: AuthenticationService) {
    this.userInfoObservable = authenticationService.getUserInfoObservable();
  }

  addSetToClass(classId: number, setId: number) {

  }

  getClasses(): Observable<Array<QuizletClass>> {
    return this.userInfoObservable.flatMap(userInfo => {
      return this.http.get(ApiConfiguration.getClassesUrl(userInfo.user_id))
        .map(response => {
          return this.serializer.deserializeFromResponse<Array<QuizletClass>>(response);
        });
    });
  }

  
}

