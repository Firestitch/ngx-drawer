import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
    selector: 'navigation',
    templateUrl: 'navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
    standalone: true,
    imports: [RouterOutlet],
})
export class NavigationComponent {


  constructor(
  ) {

  }

}
