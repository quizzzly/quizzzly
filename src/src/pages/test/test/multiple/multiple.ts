import { Component, Output, EventEmitter } from '@angular/core';
import { TermDefinition, TestStepValidationResult } from '../../../../models/models';
import { shuffleArray } from '../../../../shared/arrayUtils';

@Component({
  templateUrl: 'multiple.html',
  selector: 'multiple'
})
export class Multiple {
  @Output() disableNextButton: EventEmitter<boolean>;

  term: TermDefinition;
  terms: Array<TermDefinition>;
  suggestedTerms: Array<string>;
  isValid: boolean;
  isValidationShouldBeShown: boolean;
  isAnswered: boolean;
  selectedAnswer: string;

  private get termsExcludingCurrent() {
    return this.terms.map(x => x.term).filter(x => x !== this.term.term);
  }

  constructor() {
    this.disableNextButton = new EventEmitter<boolean>();
  }

  init(term: TermDefinition, terms: Array<TermDefinition>) {
    this.isValidationShouldBeShown = false;
    this.isValid = false;
    this.isAnswered = false;
    this.term = term;
    this.terms = terms;
    this.initRandomTerms();
    this.updateSelectedAnswer(null);
  }

  private initRandomTerms() {
    const suggestedTerms = [];
    suggestedTerms.push(this.term.term);
    const terms = this.termsExcludingCurrent;
    const numberOfSuggestedTerms = terms.length > 3 ? 3 : terms.length;
    const alreadyUsedTermIndexes = [];

    for (let i = 0; i < numberOfSuggestedTerms; i++) {
      let termIndex = 0;

      do {
        termIndex = Math.floor(Math.random() * terms.length);
      } while (alreadyUsedTermIndexes.indexOf(termIndex) !== -1);

      alreadyUsedTermIndexes.push(termIndex);
      let term = terms[termIndex];
      suggestedTerms.push(term);
    }

    this.suggestedTerms = shuffleArray(suggestedTerms);
  }

  updateSelectedAnswer(answer: string) {
    if (this.isAnswered) {
      return;
    }

    this.disableNextButton.emit(!answer);
    this.selectedAnswer = answer;
  }

  validate() {
    this.isAnswered = true;
    this.isValid = this.term.term === this.selectedAnswer;
    const validationResult = new TestStepValidationResult();
    validationResult.isValid = this.isValid;
    validationResult.term = this.term;

    return validationResult;
  }

  showValidation() {
    this.isValidationShouldBeShown = true;
  }
}
