import { Component, OnInit, ViewChild } from '@angular/core';
import { FsDrawerComponent } from '../../../../../src/components/fs-drawer/';
import { IDrawerConfig } from '../../../../../src/interfaces/fs-drawer-config.interface';

@Component({
  selector: 'fs-task-drawer',
  templateUrl: 'task-drawer.component.html',
  styleUrls: ['./task-drawer.component.scss']
})
export class TaskDrawerComponent implements OnInit {
  @ViewChild('drawer') drawer: FsDrawerComponent;

  public config: IDrawerConfig;
  public data;

  constructor() {

  }

  public ngOnInit() {

    this.config = {
      disableClose: false, // Whether the drawer can be closed with the escape key. Default to false
      position: 'right', // Anchors the drawer to the left or right side of the screen.  Default to right
      activeAction: 'settings',
      width: '500px', // The initial width of the drawer. Default to 500
      actions: [
        {
          icon: 'clear',
          type: 'button',
          click: (event) => {
            // this.drawer.close();
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
            // this.drawer.openSide();
            // this.drawer.setActiveAction('edit');
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
