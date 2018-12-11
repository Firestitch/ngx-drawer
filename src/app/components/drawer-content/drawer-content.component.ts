import { Component } from '@angular/core';

@Component({
  selector: '[fsDrawerContent]',
  template: '<div class="content"><ng-content></ng-content></div>',
  host: {
    'class': 'content-container'
  }
})
export class FsDrawerContentComponent {}
