import { Component, OnInit, inject } from '@angular/core';
import { DRAWER_DATA, DrawerDataProxy, DrawerRef } from 'fs-package';
import { Observable } from 'rxjs';
import { FsDrawerSideComponent } from '../../../../../src/app/components/drawer-side/drawer-side.component';
import { FsDrawerActionDirective } from '../../../../../src/app/directives/drawer-action.directive';
import { MatButton } from '@angular/material/button';
import { FsDrawerContentComponent } from '../../../../../src/app/components/drawer-content/drawer-content.component';
import { FsLabelModule } from '@firestitch/label';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'fs-task-drawer',
    templateUrl: 'task-drawer.component.html',
    styleUrls: ['./task-drawer.component.scss'],
    standalone: true,
    imports: [
        FsDrawerSideComponent,
        FsDrawerActionDirective,
        MatButton,
        FsDrawerContentComponent,
        FsLabelModule,
        JsonPipe,
    ],
})
export class TaskDrawerComponent implements OnInit {
  drawerRef = inject<DrawerRef<TaskDrawerComponent>>(DrawerRef);
  private _data = inject<DrawerDataProxy<any>>(DRAWER_DATA);


  public account: any = {};

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


    new Observable((observer) => {
      setTimeout(() => {
        observer.next(null);
        observer.complete();
      }, 3000)
    }).pipe(
      this.drawerRef.closeWhen(),
    ).subscribe(() => {
      debugger;
    })
  }

  public updateWidth() {
    this.drawerRef.updateDrawerWidth(700);
  }

  public updateSideWidth() {
    this.drawerRef.updateSideDrawerWidth(1000);
  }

  public enableClose() {
    this.drawerRef.enableAction('close');
  }

  public disableClose() {
    this.drawerRef.disableAction('close');
  }
}
