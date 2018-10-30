import { Component, ContentChild, Input, OnInit } from '@angular/core';
import { DrawerConfig } from '../../models/fs-drawer-config.model';
import { IDrawerConfig } from '../../interfaces/fs-drawer-config.interface';
import { Action } from '../../models/action.model';

@Component({
  selector: 'fs-drawer',
  templateUrl: 'fs-drawer.component.html',
  styleUrls: [ 'fs-drawer.component.scss' ],
})
export class FsDrawerComponent implements OnInit {
  @Input() public config: IDrawerConfig;

  @ContentChild('fsDrawerSide') public fsDrawerSide;
  @ContentChild('fsDrawer') public fsDrawer;

  public drawerConfig: DrawerConfig;

  public isOpen = false;
  public isOpenSide = false;

  constructor() {
  }

  public ngOnInit() {
    // set config with defaults params
    this.drawerConfig = new DrawerConfig(this.config);
  }

  public open() {
    this.isOpen = true;
  }

  public close() {
    this.isOpen = false;
  }

  public openSide() {
    this.isOpenSide = true;
  }

  public closeSide() {
    this.isOpenSide = false;
  }

  public click(action: Action, event) {
    if (action.click) {
      action.click.call(event);
    }
  }

}
