import { Component, Output, EventEmitter } from '@angular/core';
import { TermDefinition, TestStepValidationResult } from '../../../../models/models';

@Component({
  templateUrl: 'true-false.html',
  selector: 'true-false'
})
export class TrueFalse {
  @Output() disableNextButton: EventEmitter<boolean>;

  term: TermDefinition;
  terms: Array<TermDefinition>;
  suggestedTerm: string;
  isValid: boolean;
  isValidationShouldBeShown: boolean;
  isAnswered: boolean;
  trueIsCorrectAnswer: boolean;
  selectedAnswer: boolean;

  constructor() {
    this.disableNextButton = new EventEmitter<boolean>();
  }

  private get termsExcludingCurrent() {
    return this.terms.map(x => x.term).filter(x => x !== this.term.term);
  }

  init(term: TermDefinition, terms: Array<TermDefinition>) {
    this.isValidationShouldBeShown = false;
    this.isValid = false;
    this.isAnswered = false;
    this.term = term;
    this.terms = terms;
    this.initSuggestedTerm();
    this.updateSelectedAnswer(null);
  }

  private initSuggestedTerm() {
    this.trueIsCorrectAnswer = Math.floor(Math.random() * 2) === 1;
    this.suggestedTerm = this.trueIsCorrectAnswer ? this.term.term : this.getRandomTerm();
  }

  private getRandomTerm() {
    const terms = this.termsExcludingCurrent;
    const index = Math.floor(Math.random() * terms.length);
    return terms[index];
  }

  updateSelectedAnswer(answer: boolean) {
    if (this.isAnswered) {
      return;
    }

    this.disableNextButton.emit(answer === null);
    this.selectedAnswer = answer;
  }

  validate() {
    this.isAnswered = true;
    this.isValid = (this.trueIsCorrectAnswer && this.selectedAnswer) || (!this.trueIsCorrectAnswer && !this.selectedAnswer);
    const validationResult = new TestStepValidationResult();
    validationResult.isValid = this.isValid;
    validationResult.term = this.term;

    return validationResult;
  }

  showValidation() {
    this.isValidationShouldBeShown = true;
  }
}
