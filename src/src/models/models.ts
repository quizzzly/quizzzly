export interface IModel {
  type: ModelType;
}

export type FeedEntryType =
  'set' |
  'class_set' |
  'group_set' |
  'session'


export enum ModelType {
  set,
  class_definition,
  user,
  term
}

export enum UserAccountType {
  free,
  plus
}

export type EditMode =
  'only_me' |
  'classes' |
  'password'

export type SetVisibility =
  'public' |
  'only_me' |
  'classes' |
  'password'

export class Image {
  id: string;
  url: string;
  width: number;
  height: number;
}

export class Set implements IModel {
  get type(): ModelType {
    return ModelType.set;
  }
  id: number;
  url: string;
  title: string;
  created_by: string;
  term_count: number;
  created_date: number;
  modified_date: number;
  has_images: boolean;
  subjects: Array<any>;
  visibility: string;
  editable: string;
  has_access: boolean;
  description: string;
  lang_terms: string;
  lang_definitions: string;
  password_use: number;
  password_edit: number;
  access_type: number;
  creator_id: number;
  terms: Array<TermDefinition>;
}

export class QuizletClass implements IModel {
  get type(): ModelType {
    return ModelType.class_definition;
  }

  id: number;
  name: string;
  set_count: number;
  user_count: number;
  created_date: Date;
  is_public: boolean;
  has_access: boolean;
  description: string;
  school: School;
}

export class School {
  name: string;
  id: number;
  city: string;
  state: string;
  country: string;
  country_code: string;
  latitude: string;
  longitude: string;
}

export class StudySession {
  get title(): string {
    return this.set.title;
  }
  get termCount(): number {
    return this.set.term_count;
  }
  get createdBy(): string {
    return this.set.created_by;
  }

  id: number;
  start_date: Date;
  finish_date: Date;
  formatted_score: string;
  set: Set;
}

export class TermDefinition implements IModel {
  get type(): ModelType {
    return ModelType.term;
  }

  id: number;
  term: string;
  definition: string;
  image: Image;
}

export class AuthenticatedUserInfo {
  access_token: string;
  user_id: string;
}

export class User implements IModel {
  get type(): ModelType {
    return ModelType.user;
  }

  username: string;
  account_type: UserAccountType;
  sign_up_date: number;
  profile_image: string;
  statistic: UserStatistic;
  sets: Array<Set>;
  favorite_sets: Array<Set>;
  studied: Array<StudySession>;
  classes: Array<QuizletClass>;
}

export class UserStatistic {
  study_session_count: number;
  total_answer_count: number;
  public_sets_created: number;
  public_terms_entered: number;
  total_sets_created: number;
  total_terms_entered: number;
}

export class ClassSet {

  class: QuizletClass;
  set: Set;

  get title(): string {
    return this.set.title;
  }
  get termCount(): number {
    return this.set.term_count;
  }
  get createdBy(): string {
    return this.set.created_by;
  }
}

export class Feed {
  items: Array<FeedEntry>;
  finished: boolean;
  success: boolean;
}

export class FeedEntry {
  timestamp: number;
  display_timestamp: string;
  set_ids: string;
  item_type: FeedEntryType;
  item_data: any;
}

export class GroupSet {
  class: QuizletClass;
  set: Set;

  get title(): string {
    return this.set.title;
  }
  get termCount(): number {
    return this.set.term_count;
  }
  get createdBy(): string {
    return this.set.created_by;
  }
}

export class TestConfiguration {
  isWritten: boolean;
  isMultipleChoices: boolean;
  isTrueFalse: boolean;
  questionsCount: number;
  isStartWithDefinition: boolean;
  doInstantEvaluation: boolean;
}

export class TestStepValidationResult {
  isValid: boolean;
  term: TermDefinition;
}

export class SetSearchResults {
  total_results: number;
  total_pages: number;
  image_set_count: number;
  page: number;
  sets: Array<Set>;
}
