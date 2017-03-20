import { Component, Input } from '@angular/core';

@Component({
    selector: 'progress-bar',
    templateUrl: 'progress-bar.html',
})
export class ProgressBar {
    @Input() completedPercentage: number;
    @Input() purpose: string;

    get completedPercentageFormated() {
        return this.completedPercentage + '%';
    }
}
