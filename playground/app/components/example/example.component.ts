import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';


@Component({
  selector: 'example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleComponent implements OnInit {

  @ViewChild('drawer') public drawer;

  public ngOnInit() {
    console.log(this.drawer);
  }
}
