import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import { FsDrawerService } from '@firestitch/drawer';

import { TaskDrawerComponent } from './task-drawer';


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
      data: { account: { name: 'Name', email: 'email@email.com' } },
      disableClose: false,
      position: 'right',
      activeAction: 'settings',
      width: '500px',
      actions: [
        {
          icon: 'clear',
          type: 'button',
          click: (event) => {
            drawerRef.close();
          }
        },
        {
          icon: 'settings',
          name: 'settings',
          type: 'button',
          tooltip: 'Settings',
          click: (event) => {
          }
        },
        {
          icon: 'edit',
          name: 'edit',
          type: 'button',
          tooltip: 'Edit',
          click: (event) => {
            drawerRef.openSide();
            drawerRef.setActiveAction('edit');
          }
        },
        {
          icon: 'more_vert',
          type: 'menu',
          actions: [
            {
              icon: 'settings',
              type: 'button',
              click: (event) => {
              }
            }
          ]
        }
      ]
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
