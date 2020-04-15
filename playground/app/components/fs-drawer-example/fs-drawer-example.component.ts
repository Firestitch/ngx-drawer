import { Component, OnInit } from '@angular/core';
import { FsDrawerAction, FsDrawerService } from '@firestitch/drawer';

import { TaskDrawerComponent } from './task-drawer';
import { CustomMenuComponent } from './custom-menu';

interface ExampleDrawerData {
  account: {
    name?: string,
    email?: string,
    blocked?: boolean,
  }
}

@Component({
  selector: 'fs-drawer-example',
  templateUrl: 'fs-drawer-example.component.html',
  styleUrls: ['./fs-drawer-example.component.scss']
})
export class FsDrawerExampleComponent implements OnInit {

  public notificationsEnabled = false;

  constructor(public drawer: FsDrawerService) {}

  public openDrawer() {
    const drawerRef = this.drawer.open<ExampleDrawerData>(TaskDrawerComponent, {
      data: { account: { name: 'Name', email: 'email@email.com', blocked: false } },
      disableClose: false,
      position: 'right',
      width: {
        main: {
          initial: 500,
          min: 200,
          max: 1000,
        },
        side: {
          initial: 300,
          min: 200,
          max: 500,
        }
      },
      // activeAction: 'settings',
      actions: [
        {
          icon: 'clear',
          type: FsDrawerAction.Button,
          close: true,
          click: ({event}) => {
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
          click: ({action}) => {
            this.notificationsEnabled = !action.data;

            drawerRef.updateAction('notifications', {
              data: !action.data,
              icon: this.notificationsIcon(),
            });

            // OR only for icon
            // drawerRef.updateActionIcon('notifications', this.notificationsIcon());
          }
        },
        {
          icon: 'local_offer',
          type: FsDrawerAction.Component,
          component: CustomMenuComponent,
          data: { task_id: 10 },
          closeSide: false,
          click: ({data, menuRef, action}) => {
            setTimeout(() => {
              drawerRef.dataChange({account: {hello: 2}});
              menuRef.dataChange({task_id: 1000});
            }, 2000);
          }
        },
        {
          icon: 'more_vert',
          type: FsDrawerAction.Menu,
          actions: [
            {
              label: 'Do something',
              click: (data) => {
                console.log('clicked sub menu action', data);
              }
            },
            {
              label: 'Link',
              link: (data) => {
                return {
                  link: ['/to-some-url'],
                  queryParams: { test: 1 }
                }
              }
            },
            {
              label: 'Group',
              actions: [
                {
                  label: 'Sub Link',
                  link: (data) => {
                    return {
                      link: ['/to-another-url'],
                      queryParams: { test2: 555 }
                    }
                  }
                },
                {
                  label: 'Sub Action',
                  click: ({ data }) => {
                    console.log('group sub action', data);
                  }
                },
                {
                  label: 'Sub Action 2',
                  click: ({ data }) => {
                    console.log('group sub action 2', data);
                  },
                  show: (data) => {
                    return !data.account.blocked;
                  }
                },
                {
                  label: 'Sub Action 3',
                  click: ({ data }) => {
                    data.account.blocked = !data.account.blocked;
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

    drawerRef.dataChanged$
      .subscribe(changes => {
        console.log('dataChanged', changes);
      });
  }

  public ngOnInit() {
    this.openDrawer();
  }

  public notificationsIcon() {
    return this.notificationsEnabled ? 'volume_up' : 'volume_off';
  }
}
