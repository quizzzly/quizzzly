import { Component, Input } from '@angular/core';

@Component({
  selector: 'list-additional-component',
  templateUrl: 'list-additional-component.html'
})
export class ListAdditionalComponent {
  @Input() showListAdditionalComponent: boolean;
  @Input() showSpinner: boolean;
  @Input() showEmptyMessage: boolean;
  @Input() emptyMessage: string;
}
