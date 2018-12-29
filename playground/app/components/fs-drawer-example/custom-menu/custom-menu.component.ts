import { Component, Inject, OnInit } from '@angular/core';
import { DRAWER_MENU_DATA, DrawerMenuRef } from '@firestitch/drawer';


@Component({
  selector: 'fs-custom-menu',
  templateUrl: 'custom-menu.component.html',
  styleUrls: ['./custom-menu.component.scss']
})
export class CustomMenuComponent implements OnInit {

  constructor(public drawer: DrawerMenuRef<CustomMenuComponent>,
              @Inject(DRAWER_MENU_DATA) public data: any) {
  }

  public ngOnInit() {
    console.log(this.data, this.drawer);
  }
}
