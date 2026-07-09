import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';

import { Subject } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';

import { DrawerRef } from '../../../classes/drawer-ref';
import { FsDrawerAction } from '../../../helpers/action-type.enum';
import { Action } from '../../../models/action.model';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { FsMenuModule } from '@firestitch/menu';


@Component({
    selector: 'fs-drawer-action-item',
    templateUrl: './drawer-action-item.component.html',
    styleUrls: [
        './drawer-action-item.component.scss',
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatIconButton,
        MatTooltip,
        MatIcon,
        FsMenuModule,
    ],
})
export class FsDrawerActionItemComponent implements OnInit, OnChanges {
  drawer = inject<DrawerRef<any>>(DrawerRef);
  private _cdRef = inject(ChangeDetectorRef);

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

  constructor() {
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
