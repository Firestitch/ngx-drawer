import {ElementRef, Injectable, Injector} from '@angular/core';
import { ConnectedPosition, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType, PortalInjector } from '@angular/cdk/portal';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { FsDrawerMenuComponent } from '../components/drawer-menu/drawer-menu.component';
import { DRAWER_MENU_DATA } from '../services/drawer-menu-data';
import { DrawerMenuRef } from '../classes/drawer-menu-ref';


@Injectable()
export class FsDrawerMenuService {

  constructor(private _overlay: Overlay,
              private _injector: Injector,
              private _breakpointObserver: BreakpointObserver) {
  }

  public create(component: ComponentType<any>, container: Element, config?: any) {
    const overlayRef = this.createOverlay(container);
    const menuRef = new DrawerMenuRef(overlayRef);
    const containerRef = this.attachContainer(overlayRef, config);
    const componentRef = this.attachComponent(component, containerRef, menuRef, config);
    menuRef.containerRef = containerRef;
    containerRef.setDrawerMenuRef(menuRef);

    menuRef.componentRef = componentRef;

    return menuRef;
  }

  private createOverlay(container: Element): OverlayRef {
    const overlayConfig = this.getOverlayConfig(container);
    return this._overlay.create(overlayConfig);
  }

  private getOverlayConfig(container: Element): OverlayConfig {
    const element = new ElementRef(container); // positionStrategy needs ElementRef;

    let strategy = null;
    if (this._breakpointObserver.isMatched(Breakpoints.XSmall)) {
      strategy = this._overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically();
    } else {
      const positions: ConnectedPosition[] = [
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' }
      ];
      strategy = this._overlay
        .position()
        .flexibleConnectedTo(element)
        .withPositions(positions);
    }

    return new OverlayConfig({
      positionStrategy: strategy,
      scrollStrategy:  this._overlay.scrollStrategies.reposition(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop'
    });
  }

  private attachContainer<T, R>(overlayRef: OverlayRef, config: any) {
    const menuRef = new DrawerMenuRef<T, R>(overlayRef);
    const injector = this.createInjector(menuRef, config);
    const containerPortal = new ComponentPortal(FsDrawerMenuComponent, undefined, injector);
    const containerRef = overlayRef.attach<FsDrawerMenuComponent>(containerPortal);

    return containerRef.instance;
  }

  private attachComponent<T, R>(
    componentRef: ComponentType<T>,
    externalContainer: FsDrawerMenuComponent,
    externalRef: DrawerMenuRef<T, R>,
    config: any,
  ) {

    const injector = this.createInjector(externalRef, config);

    return externalContainer.attachComponentPortal<T>(
      new ComponentPortal<T>(componentRef, undefined, injector)
    );
  }


  private createInjector(componentRef, config) {
    const injectionTokens = new WeakMap<any, any>([
      [DrawerMenuRef, componentRef],
      [DRAWER_MENU_DATA, config]
    ]);

    return new PortalInjector(this._injector, injectionTokens);
  }
}
