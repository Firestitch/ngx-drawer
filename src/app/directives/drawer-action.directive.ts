import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[fsDrawerAction]',
})
export class FsDrawerActionDirective {

  @Input('fsDrawerAction') public name: string;
}
