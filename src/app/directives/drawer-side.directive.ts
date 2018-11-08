import { Directive } from '@angular/core';

@Directive({
  selector: '[fsDrawerSide]',
  host: {
    'class': 'side'
  }
})
export class FsDrawerSide {}
