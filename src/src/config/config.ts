import { apiBaseUrl, isDebug, tempUser } from './enviroment-specific-config.ts'

export class AuthenticationConfiguration {
  static clientId = 'hYfjeW3ePd';
  static callBackUrl = 'http://localhost/callback';
  // TODO: Remove before deploy
  static clientSecret = '88zwWe6QGPETWwr7cb8qjn';
  static authorizeUrl = 'https://quizlet.com/authorize';
  static tokenBasedUrl = 'https://api.quizlet.com/oauth/token';
  static getAuthenticationUrl(random: string): string {
    const scopes = 'read write_set write_group';
    return `${AuthenticationConfiguration.authorizeUrl}?response_type=code&client_id=${this.clientId}&scope=${scopes}&state=${random}`;
  }
}

export class ApiConfiguration {
  static get feedUrl() { return apiBaseUrl + '/feed/home'; };
  static get createSetUrl(): string { return `${apiBaseUrl}/sets`; };
  static getUpdateSetUrl(setId: number): string { return `${apiBaseUrl}/sets/${setId}`;}
  static getSetsUrl(userName: string) { return `${apiBaseUrl}/users/${userName}/sets`; };
  static getSetUrl(setId: number) { return `${apiBaseUrl}/sets/${setId}`; };
  static getSetTermsUrl(setId: number) { return `${ApiConfiguration.getSetUrl(setId)}/terms`; };
  static getClassesUrl(userName: string) { return `${apiBaseUrl}/users/${userName}/classes`; }
  static getClassUrl(classId: number) { return `${apiBaseUrl}/classes/${classId}`; }
  static getClassSetsUrl(classId: number) { return `${ApiConfiguration.getClassUrl(classId)}/sets`; }
  static getSearchSetUrl(query: string) { return `${apiBaseUrl}/search/sets?q=${query}` };
  static getNextPageSearchSetUrl(query: string, page: number) { return ApiConfiguration.getSearchSetUrl(query) +`&page=${page}` };
}

export class CommonConfiguration {
  static isDebug = isDebug;
  static tempUser = tempUser;
}
