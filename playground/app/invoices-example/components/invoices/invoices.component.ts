import { ChangeDetectionStrategy, Component, OnDestroy, ViewChild, inject } from '@angular/core';

import { FsListComponent, FsListConfig, FsListModule } from '@firestitch/list';

import { Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';

import { FsDrawerService } from 'fs-package';

import { InvoicesService } from '../../services/invoices.service';
import { InvoiceDrawerComponent } from '../invoice-drawer';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CurrencyPipe } from '@angular/common';


@Component({
    templateUrl: './invoices.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FsListModule,
        RouterLink,
        RouterOutlet,
        CurrencyPipe,
    ],
})
export class InvoicesComponent implements OnDestroy {
  private _invoicesService = inject(InvoicesService);
  private _drawer = inject(FsDrawerService);


  public config: FsListConfig;

  @ViewChild(FsListComponent)
  public list: FsListComponent;

  private _destroy$ = new Subject<void>();

  constructor() {
    this._initConfig();

    this._drawer
      .drawerRef$(InvoiceDrawerComponent)
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
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  private _initConfig(): void {
    this.config = {
      fetch: () => {
        return this._invoicesService.gets()
          .pipe(
            map((data) => {
              return {
                data,
              };
            }),
          );
      },
    };
  }

}
