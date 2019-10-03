import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  EmbeddedViewRef,
  ViewChild,
} from '@angular/core';
import {
  BasePortalOutlet,
  CdkPortalOutlet,
  ComponentPortal,
  TemplatePortal
} from '@angular/cdk/portal';
import { DrawerMenuRef } from '../../classes/drawer-menu-ref';

@Component({
  selector: 'fs-drawer-menu',
  templateUrl: 'drawer-menu.component.html',
  styleUrls: [ 'drawer-menu.component.scss' ],
  host: {
    'class': 'mat-elevation-z2'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsDrawerMenuComponent extends BasePortalOutlet {

  @ViewChild(CdkPortalOutlet) _portalOutlet: CdkPortalOutlet;

  public ref: DrawerMenuRef<any>;

  constructor() {
    super();
  }

  public setDrawerMenuRef(value: DrawerMenuRef<any>) {
    this.ref = value;

    // this.config = this.externalMenuRef.config;
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
