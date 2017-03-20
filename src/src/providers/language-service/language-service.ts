import { Injectable } from '@angular/core';
import { codes } from './language-codes';

@Injectable()
export class LanguageService {
  private codesKeys = codes.map(x => x.value);
  private codesValues = codes.map(x => x.value);

  constructor() { }
  get getLanguageCodeKeys(): Array<string> { return this.codesKeys; }
  get getLanguageCodeValues(): Array<string> { return this.codesValues; }

  findLanguageCodeByKey(key: string): string {
    return codes.filter(x => x.key === key).map(x => x.value)[0]
  }

  findLanguageCodeByValue(value: string): string {
    return codes.filter(x => x.value === value).map(x => x.key)[0]
  }
}
