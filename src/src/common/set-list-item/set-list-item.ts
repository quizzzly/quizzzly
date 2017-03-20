import { Component, Input } from '@angular/core';
import { Set } from '../../models/models';

@Component({
    selector: 'set-list-item',
    templateUrl: 'set-list-item.html'
})
export class SetListItem {
    @Input() set: Set;
}
