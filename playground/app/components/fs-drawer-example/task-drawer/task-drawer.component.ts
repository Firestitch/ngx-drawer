import { Component, Inject, OnInit } from '@angular/core';
import { DRAWER_DATA, DrawerDataProxy, DrawerRef } from '@firestitch/drawer';



@Component({
  selector: 'fs-task-drawer',
  templateUrl: 'task-drawer.component.html',
  styleUrls: ['./task-drawer.component.scss']
})
export class TaskDrawerComponent implements OnInit {

  constructor(public drawer: DrawerRef<TaskDrawerComponent>,
              @Inject(DRAWER_DATA) public data: DrawerDataProxy<any>) {
  }

  public ngOnInit() {
    console.log(this.data, this.drawer);
  }

  public toggleNotification() {
    const notificationsAction = this.drawer.getAction('notifications');
    if (notificationsAction) {
      notificationsAction.data = !notificationsAction.data;
      notificationsAction.icon = notificationsAction.data ? 'volume_up' : 'volume_off'
    }
  }
}
