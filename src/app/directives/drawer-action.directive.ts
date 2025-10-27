import { Directive, Input } from '@angular/core';

@Directive({
    selector: '[fsDrawerAction]',
    standalone: true,
})
export class FsDrawerActionDirective {

  @Input('fsDrawerAction') public name: string;
}
