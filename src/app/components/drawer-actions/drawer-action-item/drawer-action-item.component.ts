import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, EventEmitter,
  Input,
  OnChanges, OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { Subject } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';

import { DrawerRef } from '../../../classes/drawer-ref';
import { FsDrawerAction } from '../../../helpers/action-type.enum';
import { Action } from '../../../models/action.model';


@Component({
  selector: 'fs-drawer-action-item',
  templateUrl: './drawer-action-item.component.html',
  styleUrls: [
    './drawer-action-item.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsDrawerActionItemComponent implements OnInit, OnChanges {
  @Input()
  public action: Action;

  @Input()
  public activeAction: string;

  @Output()
  public actionClicked = new EventEmitter();

  public isActive = false;
  public tooltipShowDelay = 1000;
  public actionTypes = FsDrawerAction;

  private _destroy$ = new Subject<void>();

  constructor(
    public drawer: DrawerRef<any>,
    private _cdRef: ChangeDetectorRef,
  ) {
    this._listenActionChanges();
    this._listenDataChanges();
  }

  public ngOnInit(): void {
    this._updateVisibilityAndLinks();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.activeAction) {
      this.isActive = this.action.name !== '' && this.action.name === this.activeAction;
    }
  }

  public actionClick(event) {
    this.actionClicked.emit(event);
  }

  public menuActionClick(action, event) {
    if (action.click) {
      action.click.call(null, {
        data: this.drawer.drawerData,
        event,
        drawerRef: this.drawer,
        action,
      });
    }
  }

  private _listenActionChanges() {
    this.drawer.actionUpdated$
      .pipe(
        filter((name) => name === this.action.name),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._cdRef.detectChanges();
      });
  }

  private _listenDataChanges() {
    this.drawer.dataChanged$
      .pipe(
        debounceTime(50),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._updateVisibilityAndLinks();
      });
  }


  private _updateVisibilityAndLinks() {
    this._updateVisibility();
    this._updateRouterLinks();

    this._cdRef.detectChanges();
  }

  private _updateVisibility() {
    this.action.checkVisibility(this.drawer.drawerData);
  }

  private _updateRouterLinks() {
    if (this.action.type === this.actionTypes.Menu) {
      this.action.updateRouterLink({
        data: this.drawer.drawerData,
        drawerRef: this.drawer,
      });
    }
  }
}
