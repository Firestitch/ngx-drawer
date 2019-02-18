import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  templateUrl: 'examples.component.html'
})
export class ExamplesComponent {
  public config = environment;
}
