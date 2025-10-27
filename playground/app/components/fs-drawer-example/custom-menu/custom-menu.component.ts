import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';

import { DRAWER_MENU_DATA, DrawerDataProxy, DrawerMenuRef } from 'fs-package';


@Component({
    selector: 'fs-custom-menu',
    templateUrl: './custom-menu.component.html',
    styleUrls: ['./custom-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class CustomMenuComponent implements OnInit {
  drawer = inject<DrawerMenuRef<CustomMenuComponent>>(DrawerMenuRef);
  data = inject<DrawerDataProxy<{
    task_id: number;
}>>(DRAWER_MENU_DATA);


  public ngOnInit() {
    console.log(this.data.getValue(), this.drawer);
  }
}
