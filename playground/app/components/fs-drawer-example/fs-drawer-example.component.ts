import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

import { guid } from '@firestitch/common';


import { FsDrawerAction, FsDrawerService } from 'fs-package';

import { CustomMenuComponent } from './custom-menu';
import { TaskDrawerComponent } from './task-drawer';
import { MatButton } from '@angular/material/button';

interface IExampleDrawerData {
  account: {
    id: string;
    name?: string;
    email?: string;
    blocked?: boolean;
  };
}

@Component({
    selector: 'fs-drawer-example',
    templateUrl: './fs-drawer-example.component.html',
    styleUrls: ['./fs-drawer-example.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatButton],
})
export class FsDrawerExampleComponent {

  public notificationsEnabled = false;

  constructor(
    private _drawer: FsDrawerService,
    private _router: Router,
  ) { }

  public open() {
    this.openDrawer(guid());
  }

  public openDrawer(accountId) {
    const drawerRef = this._drawer
      .open<IExampleDrawerData>(TaskDrawerComponent, {
        url: this._router.createUrlTree([],
          { queryParams: { accountId } },
        ),
        data: {
          account: { id: accountId, name: 'Name', email: 'email@email.com', blocked: false },
        },
        disableClose: false,
        position: 'right',
        persist: true,
        width: {
          main: {
            initial: 500,
            min: 200,
            // max: 1000,
          },
          side: {
            initial: 300,
            min: 200,
            // max: 500,
          },
          content: {
            min: 500,
          }
        },
        actions: [
          {
            icon: 'clear',
            name: 'close',
            type: FsDrawerAction.Button,
            close: true,
            //disabled: true,
            click: ({ event }) => {
              console.log('close clicked');
            },
          },
          {
            icon: 'settings',
            name: 'settings',
            type: FsDrawerAction.Button,
            tooltip: 'Settings',
          },
          {
            icon: 'edit',
            name: 'edit',
            type: FsDrawerAction.Button,
            tooltip: 'Edit',
          },
          {
            icon: this.notificationsIcon(),
            name: 'notifications',
            type: FsDrawerAction.Button,
            toggle: false,
            tooltip: 'Notifications',
            data: this.notificationsEnabled,
            click: ({ action }) => {
              this.notificationsEnabled = !action.data;

              drawerRef.updateAction('notifications', {
                data: !action.data,
                icon: this.notificationsIcon(),
              });

              // OR only for icon
              // drawerRef.updateActionIcon('notifications', this.notificationsIcon());
            },
          },
          {
            icon: 'local_offer',
            type: FsDrawerAction.Component,
            component: CustomMenuComponent,
            data: { task_id: 10 },
            closeSide: false,
            click: ({ data, menuRef, action }) => {
              setTimeout(() => {
                drawerRef.dataChange({ account: { hello: 2 } });
                menuRef.dataChange({ task_id: 1000 });
              }, 2000);
            },
          },
          {
            icon: 'more_vert',
            type: FsDrawerAction.Menu,
            actions: [
              {
                label: 'Do something',
                click: (data) => {
                  console.log('clicked sub menu action', data);
                },
              },
              {
                label: 'Link',
                link: (data) => {
                  return {
                    link: ['/to-some-url'],
                    queryParams: { test: 1 },
                  };
                },
              },
              {
                label: 'Group',
                actions: [
                  {
                    label: 'Sub Link',
                    link: (data) => {
                      return {
                        link: ['/to-another-url'],
                        queryParams: { test2: 555 },
                      };
                    },
                  },
                  {
                    label: 'Sub Action',
                    click: ({ data }) => {
                      console.log('group sub action', data);
                    },
                  },
                  {
                    label: 'Sub Action 2',
                    click: ({ data }) => {
                      console.log('group sub action 2', data);
                    },
                    show: (data) => {
                      return !data.account.blocked;
                    },
                  },
                  {
                    label: 'Sub Action 3',
                    click: ({ data }) => {
                      data.account.blocked = !data.account.blocked;
                      drawerRef.dataChange(data);
                      console.log('group sub action 3', data);
                    },
                  },
                ],
              },
            ],
          },
        ],
      });

    drawerRef.afterClosed$.subscribe(() => {
      console.log('The drawer was closed');
    });

    drawerRef.afterOpened$.subscribe(() => {
      console.log('The drawer was opened');
    });

    drawerRef.closeStart$.subscribe((result) => {
      console.log('close starts');
      result.next(null);
    });

    drawerRef.openStart$.subscribe((result) => {
      console.log('open starts');
      result.next(null);
    });

    drawerRef.dataChanged$
      .subscribe((changes) => {
        console.log('dataChanged', changes);
      });
  }

  public notificationsIcon() {
    return this.notificationsEnabled ? 'volume_up' : 'volume_off';
  }
}
