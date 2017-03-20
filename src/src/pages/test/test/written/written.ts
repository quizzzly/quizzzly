import { Component, Output, EventEmitter } from '@angular/core';
import { TermDefinition, TestStepValidationResult } from '../../../../models/models';
import { areTheSameValues } from '../../../../shared/termUtils';

@Component({
  templateUrl: 'written.html',
  selector: 'written'
})
export class Written {
  @Output() disableNextButton: EventEmitter<boolean>;

  term: TermDefinition;
  suggestedTerm: string;
  isValid: boolean;
  isValidationShouldBeShown: boolean;
  isAnswered: boolean;

  constructor() {
    this.disableNextButton = new EventEmitter<boolean>();
  }

  init(term: TermDefinition, terms: Array<TermDefinition>) {
    this.isValidationShouldBeShown = false;
    this.isValid = false;
    this.isAnswered = false;
    this.term = term;
    this.updateSuggestedTerm(null);
  }

  updateSuggestedTerm(term) {
    this.disableNextButton.emit(!term);
    this.suggestedTerm = term;
  }

  validate(): TestStepValidationResult {
    this.isAnswered = true;
    this.isValid = areTheSameValues(this.term.term, this.suggestedTerm);
    const validationResult = new TestStepValidationResult();
    validationResult.isValid = this.isValid;
    validationResult.term = this.term;

    return validationResult;
  }

  showValidation() {
    this.isValidationShouldBeShown = true;
  }
}
