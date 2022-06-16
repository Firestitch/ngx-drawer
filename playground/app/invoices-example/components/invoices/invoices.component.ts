import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FsListComponent, FsListConfig } from '@firestitch/list';

import { Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';

import { FsDrawerService } from 'fs-package';

import { InvoicesService } from '../../services/invoices.service';
import { InvoiceDrawerComponent } from '../invoice-drawer';


@Component({
  templateUrl: './invoices.component.html',
})
export class InvoicesComponent implements OnDestroy {

  public config: FsListConfig;

  @ViewChild(FsListComponent)
  public list: FsListComponent;

  private _destroy$ = new Subject<void>();

  constructor(
    private _invoicesService: InvoicesService,
    private _drawer: FsDrawerService,
  ) {
    this._initConfig();

    this._drawer.drawerRef$(InvoiceDrawerComponent)
      .pipe(
        switchMap((drawerRef) => drawerRef.afterClosed$),
        takeUntil(this._destroy$),
      )
      .subscribe((data) => {
        console.log('DrawerRef Data:', data);

        if (data) {
          this.list.reload();
        }
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _initConfig(): void {
    this.config = {
      fetch: () => {
        return this._invoicesService.gets()
          .pipe(
            map((data) => {
              return {
                data
              };
            })
          )
      },
    };
  }

}
