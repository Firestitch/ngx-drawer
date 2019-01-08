import { Component, OnInit } from '@angular/core';
import { FsDrawerAction, FsDrawerService } from '@firestitch/drawer';

import { TaskDrawerComponent } from './task-drawer';
import { CustomMenuComponent } from './custom-menu';


@Component({
  selector: 'fs-drawer-example',
  templateUrl: 'fs-drawer-example.component.html',
  styleUrls: ['./fs-drawer-example.component.scss']
})
export class FsDrawerExampleComponent implements OnInit {

  constructor(public drawer: FsDrawerService) {}

  public openDrawer() {
    const drawerRef = this.drawer.open(TaskDrawerComponent, {
      data: { account: { name: 'Name', email: 'email@email.com' } },
      disableClose: false,
      position: 'right',
      //activeAction: 'settings',
      width: 'auto',
      resize: {
        min: 200,
        max: 99999,
        //minSide: 100,
        //maxSide: 300,
      },
      actions: [
        {
          icon: 'clear',
          type: FsDrawerAction.button,
          close: true,
          click: (event) => {
            console.log('close clicked');
          }
        },
        {
          icon: 'settings',
          name: 'settings',
          type: FsDrawerAction.button,
          tooltip: 'Settings',
          click: (event) => {
          }
        },
        {
          icon: 'edit',
          name: 'edit',
          type: FsDrawerAction.button,
          tooltip: 'Edit',
          click: (event) => {
          }
        },
        {
          icon: 'local_offer',
          type: FsDrawerAction.component,
          component: CustomMenuComponent,
          data: { task_id: 10 },
          closeSide: false,
          click: (event, menuRef) => {

            setTimeout(() => {
              menuRef.dataChange({task_id: 1000});
            }, 2000);
          }
        },
        {
          icon: 'more_vert',
          type: FsDrawerAction.menu,
          actions: [
            {
              icon: 'settings',
              label: 'Do something..',
              click: (event) => {
                console.log('clicked sub menu action');
              }
            }
          ]
        },
      ]
    });

    drawerRef.afterClosed().subscribe(() => {
      console.log('The drawer was closed');
    });

    drawerRef.afterOpened().subscribe(() => {
      console.log('The drawer was opened');
    });

    drawerRef.closeStart().subscribe((result) => {
      console.log('close starts');
      result.next();
    });

    drawerRef.openStart().subscribe((result) => {
      console.log('open starts');
      result.next();
    });

  }

  public ngOnInit() {
    // Avoids: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: 'klass: undefined'
    setTimeout(() => {
      this.openDrawer();
    });
  }
}
