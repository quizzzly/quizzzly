import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class SerializationService {
  serialize(obj: any): string {
    return JSON.stringify(obj);
  }

  serializeDate(date: Date): string {
    let timeStamp = date.getTime() / 1000;
    return timeStamp.toString();
  }

  deserialize<T>(json: string) {
    return <T>JSON.parse(json);
  }

  deserializeFromResponse<T>(response: Response): T {
    return <T>response.json();
  }
}



