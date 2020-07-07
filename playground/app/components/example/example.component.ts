import {Component, OnInit, ViewChild} from '@angular/core';


@Component({
  selector: 'example',
  templateUrl: 'example.component.html'
})
export class ExampleComponent implements OnInit {

  @ViewChild('drawer') drawer;

  public ngOnInit() {
    console.log(this.drawer);
  }
}
