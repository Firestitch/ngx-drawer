import { Component, ContentChild, Input, OnInit } from '@angular/core';
import { DrawerConfig } from '../../models/fs-drawer-config.model';
import { IDrawerConfig } from '../../interfaces/fs-drawer-config.interface';

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

  constructor() {
  }

  public ngOnInit() {
    // set config with defaults params
    this.drawerConfig = new DrawerConfig(this.config);
  }

  public open() {

  }

  public close() {
    console.log('close');
  }
}
