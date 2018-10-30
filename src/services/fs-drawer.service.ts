import { Injectable, InjectionToken, Injector } from '@angular/core';
import { Overlay, OverlayConfig, OverlayContainer, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType, PortalInjector } from '@angular/cdk/portal';

import { DrawerRef } from '../components/fs-drawer/classes/drawer-ref';

/** Injection token that can be used to access the data that was passed in to a drawer. */
export const DRAWER_DATA = new InjectionToken<any>('DrawerData');

@Injectable()
export class FsDrawerService {

  constructor(private _overlay: Overlay,
              private _injector: Injector,
              private _overlayContainer: OverlayContainer) {
  }

  public open(component: ComponentType<any>, config?) {
    const overlayRef = this.createOverlay(config);
    const containerRef = this.attachComponent(component, overlayRef, config);

    return containerRef;
  }

  private createOverlay(config): OverlayRef {
    const overlayConfig = this.getOverlayConfig(config);
    return this._overlay.create(overlayConfig);
  }

  private getOverlayConfig(dialogConfig): OverlayConfig {
    return new OverlayConfig();
  }

  private attachComponent<T, R>(componentRef, overlayRef, config ) {
    const drawerRef = new DrawerRef<T, R>(overlayRef, config);
    const injector = this.createInjector(drawerRef, config);
    const portal = new ComponentPortal(componentRef, undefined, injector);
    drawerRef.container = overlayRef.attach(portal);

    return drawerRef;
  }


  private createInjector(componentRef, config) {
    const injectionTokens = new WeakMap<any, any>([
      [DrawerRef, componentRef],
      [DRAWER_DATA, config.data]
    ]);

    return new PortalInjector(this._injector, injectionTokens);
  }


}
