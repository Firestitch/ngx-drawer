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

  public notificationsEnabled = false;

  constructor(public drawer: FsDrawerService) {}

  public openDrawer() {
    const drawerRef = this.drawer.open(TaskDrawerComponent, {
      data: { account: { name: 'Name', email: 'email@email.com', blocked: false } },
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
          type: FsDrawerAction.Button,
          close: true,
          click: (event) => {
            console.log('close clicked');
          }
        },
        {
          icon: 'settings',
          name: 'settings',
          type: FsDrawerAction.Button,
          tooltip: 'Settings',
          click: (event) => {
          }
        },
        {
          icon: 'edit',
          name: 'edit',
          type: FsDrawerAction.Button,
          tooltip: 'Edit',
          click: (event) => {
          }
        },
        {
          icon: this.notificationsIcon(),
          name: 'notifications',
          type: FsDrawerAction.Button,
          toggle: false,
          tooltip: 'Notifications',
          data: this.notificationsEnabled,
          click: (data) => {
            data.action.data = !data.action.data;
            this.notificationsEnabled = data.action.data;

            data.action.icon = this.notificationsIcon();
          }
        },
        {
          icon: 'local_offer',
          type: FsDrawerAction.Component,
          component: CustomMenuComponent,
          data: { task_id: 10 },
          closeSide: false,
          click: (event, menuRef) => {

            setTimeout(() => {
              drawerRef.dataChange({hello: 2});
              menuRef.dataChange({task_id: 1000});
            }, 2000);
          }
        },
        {
          icon: 'more_vert',
          type: FsDrawerAction.Menu,
          actions: [
            {
              label: 'Do something..',
              click: (event) => {
                console.log('clicked sub menu action');
              }
            },
            {
              label: 'Group',
              actions: [
                {
                  label: 'Sub Action',
                  click: (data) => {
                    console.log('group sub action', data);
                  }
                },
                {
                  label: 'Sub Action 2',
                  click: (data) => {
                    console.log('group sub action 2', data);
                  },
                  show: (data: any) => {
                    return !data.blocked;
                  }
                },
                {
                  label: 'Sub Action 3',
                  click: (data) => {
                    data.blocked = !data.blocked;
                    drawerRef.dataChange(data);
                    console.log('group sub action 3', data);
                  }
                }
              ]
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
    this.openDrawer();
  }

  public notificationsIcon() {
    return this.notificationsEnabled ? 'volume_up' : 'volume_off';
  }
}
