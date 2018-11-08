import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { IDrawerConfig } from '../../../../../src/interfaces/';
import { DrawerRef } from '../../../../../src/classes';
import { DRAWER_DATA } from '../../../../../src/services/';

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
    this.drawer.template = this.drawerTemplate; // for connection drawer component for dynamic components

    this.config = {

    };

  }
}
