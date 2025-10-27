import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';

import { DRAWER_MENU_DATA, DrawerDataProxy, DrawerMenuRef } from 'fs-package';


@Component({
    selector: 'fs-custom-menu',
    templateUrl: './custom-menu.component.html',
    styleUrls: ['./custom-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class CustomMenuComponent implements OnInit {

  constructor(public drawer: DrawerMenuRef<CustomMenuComponent>,
    @Inject(DRAWER_MENU_DATA) public data: DrawerDataProxy<{ task_id: number }>) {
  }

  public ngOnInit() {
    console.log(this.data.getValue(), this.drawer);
  }
}
