import {
  Component,
  ComponentRef,
  EmbeddedViewRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  HostBinding
} from '@angular/core';

import {
  BasePortalOutlet,
  CdkPortalOutlet,
  ComponentPortal,
  TemplatePortal
} from '@angular/cdk/portal';

import { DrawerRef } from '../../classes/drawer-ref';
import { DrawerConfig } from '../../models/drawer-config.model';


@Component({
  selector: 'fs-drawer',
  templateUrl: './drawer.component.html',
  host: {
    'class': 'fs-drawer-container',
  },
  encapsulation: ViewEncapsulation.None
})
export class FsDrawerComponent extends BasePortalOutlet implements OnInit {

  @ViewChild(CdkPortalOutlet) _portalOutlet: CdkPortalOutlet;
  @HostBinding('class.side-open') public sideOpen: boolean = false;

  public config: DrawerConfig;
  public isOpen = false;
  public isOpenSide = false;

  public drawerRef: DrawerRef<any>;

  public initialized = false;

  constructor() {
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
    if (action.click) {
      action.click.call(event);
    }

    if (action.close) {
      this.drawerRef.close();
      return;
    }

    if (this.drawerRef.isSideOpen && this.drawerRef.activeAction === action.name) {
      this.drawerRef.toggleSide();
    } else {
      this.drawerRef.setActiveAction(action.name);
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
  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this._portalOutlet.hasAttached()) {
      throw Error('Drawer template already attached');
    }

    return this._portalOutlet.attachTemplatePortal(portal);
  }


}
