import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { IDrawerConfig } from '../../../../../src/interfaces/';
import { DrawerRef } from '../../../../../src/components/fs-drawer/';
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
      disableClose: false,
      position: 'right',
      activeAction: 'settings',
      width: '500px',
      actions: [
        {
          icon: 'clear',
          type: 'button',
          click: (event) => {
            this.drawer.close();
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
            this.drawer.openSide();
            this.drawer.setActiveAction('edit');
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
    };

  }
}
