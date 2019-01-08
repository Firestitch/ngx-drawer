import {
  OnInit,
  Component,
  ViewChild,
  HostBinding,
  ElementRef,
  ComponentRef,
  EmbeddedViewRef,
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


@Component({
  selector: 'fs-drawer',
  templateUrl: './drawer.component.html',
  providers: [ FsDrawerMenuService ],
  host: {
    'class': 'fs-drawer-container',
  },
  encapsulation: ViewEncapsulation.None
})
export class FsDrawerComponent extends BasePortalOutlet implements OnInit {

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

  constructor(private _drawerMenu: FsDrawerMenuService) {
    super();
  }

  public ngOnInit() {
    // set config with defaults params
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

    const hasComponentType = action.type === FsDrawerAction.component;

    if (hasComponentType) {
      const menuRef = this._drawerMenu.create(action.component, event.srcElement, action);

      this.drawerRef.addMenuRef(action.menuRefName, menuRef);

      // Call click
      action.click.call(null, event, menuRef);

      if (action.closeSide) {
        this.drawerRef.closeSide();
      }
    } else if (action.click) {
      action.click.call(null, event);
    }

    if (action.close) {
      this.drawerRef.close();
    }

    if (!hasComponentType || action.closeSide) {
      if (this.drawerRef.isSideOpen && this.drawerRef.activeAction === action.name) {
        this.drawerRef.toggleSide();
      } else {
        this.drawerRef.setActiveAction(action.name);
      }
    }
  }

  public menuActionClick({ action, event }) {
    if (action.click) {
      action.click.call(event);
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

}
