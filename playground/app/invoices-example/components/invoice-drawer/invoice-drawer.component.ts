import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RouteObserver } from '@firestitch/core';

import { DrawerRef, FsDrawerAction, IDrawerComponent, IDrawerConfig } from 'fs-package';


@Component({
  templateUrl: './invoice-drawer.component.html',
  styleUrls: ['./invoice-drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceDrawerComponent implements IDrawerComponent {

  public invoice$: RouteObserver<any>;

  public drawerConfig: IDrawerConfig = {
    disableClose: false,
    persist: true,
    actions: [
      {
        icon: 'clear',
        name: 'close',
        type: FsDrawerAction.Button,
        close: true,
      },
    ],
  };

  constructor(
    public drawerRef: DrawerRef<InvoiceDrawerComponent>,
    private _route: ActivatedRoute,
  ) {
    this.invoice$ = new RouteObserver<any>(this._route, 'invoice');
  }

}
