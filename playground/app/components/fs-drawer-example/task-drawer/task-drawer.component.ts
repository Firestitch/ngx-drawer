import { Component, Inject, OnInit } from '@angular/core';
import { DRAWER_DATA, DrawerDataProxy, DrawerRef } from '@firestitch/drawer';


@Component({
  selector: 'fs-task-drawer',
  templateUrl: 'task-drawer.component.html',
  styleUrls: ['./task-drawer.component.scss']
})
export class TaskDrawerComponent implements OnInit {

  public account: any = {};

  constructor(private drawerRef: DrawerRef<TaskDrawerComponent>,
              @Inject(DRAWER_DATA) private _data: DrawerDataProxy<any>) {}

  public ngOnInit() {
    this.account = this._data.account;
  }

  public toggleNotification() {
    const notificationsAction = this.drawerRef.getAction('notifications');

    if (notificationsAction) {
      this.drawerRef.updateAction(notificationsAction.name, {
        data: !notificationsAction.data,
        icon: !notificationsAction.data ? 'volume_up' : 'volume_off'
      });
    }
  }

  public dataChange() {
    this.account.name = 'Name Changed!';
    this.drawerRef.dataChange({ account: this.account });
  }

  public updateWidth() {
    this.drawerRef.updateDrawerWidth(700);
  }

  public updateSideWidth() {
    this.drawerRef.updateSideDrawerWidth(1000);
  }
}
