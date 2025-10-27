import { Component } from '@angular/core';

@Component({
    selector: '[fsDrawerContent]',
    template: '<div class="content"><ng-content></ng-content></div>',
    host: {
        'class': 'content-container'
    },
    standalone: true
})
export class FsDrawerContentComponent {}
