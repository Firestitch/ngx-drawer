import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  HostBinding, OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import {
  BasePortalOutlet,
  CdkPortalOutlet,
  ComponentPortal,
  TemplatePortal,
} from '@angular/cdk/portal';

import { DrawerRef } from '../../classes/drawer-ref';
import { DrawerConfig } from '../../models/drawer-config.model';
import { FsDrawerAction } from '../../helpers/action-type.enum';
import { FsDrawerMenuService } from '../../services/drawer-menu.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'fs-drawer',
  templateUrl: './drawer.component.html',
  providers: [ FsDrawerMenuService ],
  host: {
    'class': 'fs-drawer-container',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsDrawerComponent extends BasePortalOutlet implements OnInit, OnDestroy {

  @HostBinding('class.side-open')
  public sideOpen = false;

  public config: DrawerConfig;
  public isOpen = false;
  public isOpenSide = false;

  public drawerRef: DrawerRef<any>;

  public initialized = false;

  @ViewChild(CdkPortalOutlet)
  private _portalOutlet: CdkPortalOutlet;

  @ViewChild('drawerContentContainer')
  private _drawerContentContainer: ElementRef;

  @ViewChild('drawerActionsContainer', { read: ElementRef })
  private _drawerActionsContainer: ElementRef;

  private _destroy$ = new Subject();

  constructor(
    private _drawerMenu: FsDrawerMenuService,
    private _drawerRef: DrawerRef<any>,
    private _cdRef: ChangeDetectorRef,
  ) {
    super();
  }

  public ngOnInit() {
    this._listenDataChanges();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public open() {
    this.isOpen = true;
  }

  public close() {
    this.isOpen = false;
  }

  public openSide() {
    this.isOpenSide = true;
  }

  public closeSide() {
    this.isOpenSide = false;
  }

  public actionClick({ action, event }) {

    const hasComponentType = action.type === FsDrawerAction.Component;

    if (hasComponentType) {
      const menuRef = this._drawerMenu.create(action.component, event.srcElement, action);

      this.drawerRef.addMenuRef(action.menuRefName, menuRef);

      // Call click
      action.click.call(null, { event: event, action: action }, menuRef);

      if (action.closeSide) {
        this.drawerRef.closeSide();
      }
    } else if (action.click) {
      action.click.call(null, { event: event, action: action });
    }

    if (action.close) {
      this.drawerRef.close();
    }

    if (action.toggle && (!hasComponentType || action.closeSide)) {
      if (this.drawerRef.isSideOpen && this.drawerRef.activeAction === action.name) {
        this.drawerRef.toggleSide();
      } else {
        this.drawerRef.setActiveAction(action.name);
      }
    }
  }

  public menuActionClick({ action, data, event }) {
    if (action.click) {
      action.click.call(null, data, event);
    }
  }

  public setDrawerRef(value: DrawerRef<any>) {
    this.drawerRef = value;

    this.config = this.drawerRef.drawerConfig;

    // Need to be like a parent for children resize
    this.drawerRef.drawerContentContainer = this._drawerContentContainer;
    this.drawerRef.drawerActionsContainer = this._drawerActionsContainer;

    this.drawerRef.sideToggle().subscribe((opened) => {
      this.sideOpen = opened;
    });

    this.initialized = true;
  }

  /**
   * Attach a ComponentPortal as content to this dialog container.
   * @param portal Portal to be attached as the dialog content.
   */
  public attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    if (this._portalOutlet.hasAttached()) {
      throw Error('Drawer component already attached');
    }

    return this._portalOutlet.attachComponentPortal(portal);
  }

  /**
   * Attach a TemplatePortal as content to this dialog container.
   * @param portal Portal to be attached as the dialog content.
   */
  public attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this._portalOutlet.hasAttached()) {
      throw Error('Drawer template already attached');
    }

    return this._portalOutlet.attachTemplatePortal(portal);
  }

  private _listenDataChanges() {
    this._drawerRef.dataChanged$
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(() => {
        this._cdRef.detectChanges();
      });
  }
}
