import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { DRAWER_DATA, DrawerRef, IDrawerConfig } from '@firestitch/drawer';


@Component({
  selector: 'fs-task-drawer',
  templateUrl: 'task-drawer.component.html',
  styleUrls: ['./task-drawer.component.scss']
})
export class TaskDrawerComponent implements OnInit {
  @ViewChild('drawerTemplate') public drawerTemplate;

  public config: IDrawerConfig;

  constructor(public drawer: DrawerRef<TaskDrawerComponent>,
              @Inject(DRAWER_DATA) public data: any) {
  }

  public ngOnInit() {
    console.log(this.data);
    // this.drawer.template = this.drawerTemplate; // for connection drawer component for dynamic components

    // this.config = {
    //
    // };
  }
}
