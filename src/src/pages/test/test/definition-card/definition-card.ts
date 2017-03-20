import { Component, Input } from '@angular/core';

@Component({
    templateUrl: 'definition-card.html',
    selector: 'definition-card'
})
export class DefinitionCard {
    @Input() definition: string;
    @Input() imageSrc: string;
}
