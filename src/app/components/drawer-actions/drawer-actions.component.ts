import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';

import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { FsDrawerAction } from '../../helpers/action-type.enum';
import { DrawerRef } from '../../classes/drawer-ref';
import { Action } from '../../models/action.model';


@Component({
  selector: 'fs-drawer-actions',
  templateUrl: './drawer-actions.component.html',
  styleUrls: [ './drawer-actions.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsDrawerActionsComponent implements OnInit, OnDestroy {
  @Input() public actions: Action[];
  @Input() public activeAction: string;

  @Output() public actionClicked = new EventEmitter();
  @Output() public menuActionClicked = new EventEmitter();

  public actionTypes = FsDrawerAction;

  private _destroy$ = new Subject<void>();

  constructor(
    public drawer: DrawerRef<any>,
    private _cdRef: ChangeDetectorRef,
  ) {
    this._listenDataChanges();
    this._listenActionsChanges();
  }

  public ngOnInit() {
    this._updateActionsVisibility();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public actionClick(action, data, event) {
    this.actionClicked.next({ action, data, event });
  }

  public menuActionClick(action, data, event) {
    this.menuActionClicked.next({ action, data, event });
  }

  private _listenDataChanges() {
    this.drawer.dataChanged$
      .pipe(
        takeUntil(this._destroy$),
        debounceTime(50),
      )
      .subscribe(() => {
        this._updateActionsVisibility();

        this._cdRef.detectChanges();
      });
  }

  private _listenActionsChanges() {
    this.drawer.actionUpdated$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
      this._cdRef.detectChanges();
    })
  }

  private _updateActionsVisibility() {
    this.actions.forEach((action) => {
      action.checkVisibility(this.drawer.drawerData);
    });
  }
}
