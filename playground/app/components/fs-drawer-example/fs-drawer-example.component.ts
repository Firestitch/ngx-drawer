import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import { FsDrawerService } from '../../../../src/services/fs-drawer.service';
import {TaskDrawerComponent} from './task-drawer/task-drawer.component';

@Component({
  selector: 'fs-drawer-example',
  templateUrl: 'fs-drawer-example.component.html',
  styleUrls: ['./fs-drawer-example.component.scss']
})
export class FsDrawerExampleComponent implements OnInit {
  @ViewChild('task', { read: ViewContainerRef }) task: ViewContainerRef;

  constructor(public drawer: FsDrawerService) {

  }

  public openDrawer() {
    const drawerRef = this.drawer.open(TaskDrawerComponent, {
      data: { account: { name: 'Name', email: 'email@email.com' } }
    });

    drawerRef.afterClosed().subscribe(() => {
      console.log('The drawer was closed');
    });

    drawerRef.afterOpened().subscribe(() => {
      console.log('The drawer was opened');
    });

  }

  public ngOnInit() {

  }
}
