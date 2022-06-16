import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RouteObserver } from '@firestitch/core';

import { DrawerRef, FsDrawerAction, IDrawerConfig, IDrawerComponent } from 'fs-package';


@Component({
  templateUrl: 'invoice-drawer.component.html',
  styleUrls: ['./invoice-drawer.component.scss'],
})
export class InvoiceDrawerComponent implements OnInit, IDrawerComponent {

  public invoice$ = new RouteObserver<any>(this._route, 'invoice');

  constructor(
    public drawerRef: DrawerRef<InvoiceDrawerComponent>,
    private _route: ActivatedRoute,
  ) {
  }

  public ngOnInit() {}

  public drawerConfig: IDrawerConfig = {
    disableClose: false,
    persist: true,
    actions: [
      {
        icon: 'clear',
        name: 'close',
        type: FsDrawerAction.Button,
        close: true
      },
    ]
  }
}
