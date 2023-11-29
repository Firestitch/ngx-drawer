import { ElementRef, Injectable, Injector } from '@angular/core';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ConnectedPosition, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType, PortalInjector } from '@angular/cdk/portal';

import { DrawerData } from '../classes/drawer-data';
import { DrawerMenuRef } from '../classes/drawer-menu-ref';
import { FsDrawerMenuComponent } from '../components/drawer-menu/drawer-menu.component';
import { DRAWER_MENU_DATA } from '../services/drawer-menu-data';


@Injectable()
export class FsDrawerMenuService {

  constructor(private _overlay: Overlay,
    private _injector: Injector,
    private _breakpointObserver: BreakpointObserver) {
  }

  public create(component: ComponentType<any>, container: Element, config?: any) {
    const overlayRef = this._createOverlay(container);
    const dataFactory = DrawerData.createWithProxy(config.data);
    const menuRef = new DrawerMenuRef(overlayRef, dataFactory);
    const containerRef = this._attachContainer(overlayRef, menuRef, dataFactory);
    const componentRef = this._attachComponent(component, containerRef, menuRef, dataFactory);
    menuRef.containerRef = containerRef;
    containerRef.setDrawerMenuRef(menuRef);

    menuRef.componentRef = componentRef;

    return menuRef;
  }

  private _createOverlay(container: Element): OverlayRef {
    const overlayConfig = this._getOverlayConfig(container);

    return this._overlay.create(overlayConfig);
  }

  private _getOverlayConfig(container: Element): OverlayConfig {
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
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
      ];
      strategy = this._overlay
        .position()
        .flexibleConnectedTo(element)
        .withPositions(positions);
    }

    return new OverlayConfig({
      positionStrategy: strategy,
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });
  }

  private _attachContainer<T, R>(overlayRef: OverlayRef, menuRef: DrawerMenuRef<T, R>, dataFactory: DrawerData) {
    const injector = this.createInjector(menuRef, dataFactory);
    const containerPortal = new ComponentPortal(FsDrawerMenuComponent, undefined, injector);
    const containerRef = overlayRef.attach<FsDrawerMenuComponent>(containerPortal);

    return containerRef.instance;
  }

  private _attachComponent<T, TR>(
    componentRef: ComponentType<T>,
    externalContainer: FsDrawerMenuComponent,
    externalRef: DrawerMenuRef<T, TR>,
    config: any,
  ) {

    const injector = this.createInjector(externalRef, config);

    return externalContainer.attachComponentPortal<T>(
      new ComponentPortal<T>(componentRef, undefined, injector),
    );
  }


  private createInjector(componentRef, dataFactory: DrawerData) {
    const injectionTokens = new WeakMap<any, any>([
      [DrawerMenuRef, componentRef],
      [DRAWER_MENU_DATA, dataFactory],
    ]);

    return new PortalInjector(this._injector, injectionTokens);
  }
}
