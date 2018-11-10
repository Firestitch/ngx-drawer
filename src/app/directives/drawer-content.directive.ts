import { Directive } from '@angular/core';

@Directive({
  selector: '[fsDrawerContent]',
  host: {
    'class': 'content'
  }
})
export class FsDrawerContentDirective {}
