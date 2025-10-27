import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { Subject } from 'rxjs';

import { FsDrawerAction } from '../../helpers/action-type.enum';
import { DrawerRef } from '../../classes/drawer-ref';
import { Action } from '../../models/action.model';
import { FsDrawerMenuService } from '../../services/drawer-menu.service';
import { FsDrawerActionItemComponent } from './drawer-action-item/drawer-action-item.component';
import { MatIconAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';


@Component({
    selector: 'fs-drawer-actions',
    templateUrl: './drawer-actions.component.html',
    styleUrls: ['./drawer-actions.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FsDrawerActionItemComponent,
        MatIconAnchor,
        MatIcon,
    ],
})
export class FsDrawerActionsComponent implements OnInit, OnDestroy {

  @Input()
  public actions: Action[];

  @Input()
  public activeAction: string;

  private _destroy$ = new Subject<void>();

  constructor(
    private _drawerRef: DrawerRef<any>,
    private _drawerMenu: FsDrawerMenuService,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public actionClick(action, event) {
    const hasComponentType = action.type === FsDrawerAction.Component;
    const hasMenuType = action.type === FsDrawerAction.Menu;

    if (hasComponentType) {
      const menuRef = this._drawerMenu.create(action.component, event.srcElement, action);

      this._drawerRef.addMenuRef(action.menuRefName, menuRef);

      const params = {
        event: event,
        action: action,
        drawerRef: this._drawerRef,
        menuRef: menuRef
      };
      // Call click
      action.click.call(null, params);

      if (action.closeSide) {
        this._drawerRef.closeSide();
      }
    } else if (action.click) {
      const params = { event: event, action: action };
      action.click.call(null, params);
    }

    if (action.close) {
      this._drawerRef.close();
    }

    if (action.toggle && ((!hasComponentType && !hasMenuType) || action.closeSide)) {
      if (this._drawerRef.isSideOpen && this._drawerRef.activeAction === action.name) {
        this._drawerRef.toggleSide();
      } else {
        this._drawerRef.activateAction(action.name);
      }
    }
  }

  public muteEvent(e) {
    e.stopImmediatePropagation();
    e.stopPropagation();
  }
}
