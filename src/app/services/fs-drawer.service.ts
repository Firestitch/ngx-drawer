import { Injectable, InjectionToken, Injector } from '@angular/core';
import { Overlay, OverlayConfig, OverlayContainer, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType, PortalInjector } from '@angular/cdk/portal';

import { FsDrawerComponent } from '../components';
import { DrawerRef } from '../classes';
import { IDrawerConfig } from '../interfaces';

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
    // const drawerContainer =
    const containerRef = this.attachDrawerContainer(overlayRef, config);
    const componentRef = this.attachComponent(component, containerRef, overlayRef, config);

    // console.log(containerRef);
    return componentRef;
  }

  private createOverlay(config): OverlayRef {
    const overlayConfig = this.getOverlayConfig(config);
    return this._overlay.create(overlayConfig);
  }

  private getOverlayConfig(dialogConfig): OverlayConfig {
    return new OverlayConfig();
  }

  private attachDrawerContainer<T, R>(overlayRef: OverlayRef, config: IDrawerConfig) {
    const drawerRef = new DrawerRef<T, R>(overlayRef, config);
    const injector = this.createInjector(drawerRef, config);
    const containerPortal = new ComponentPortal(FsDrawerComponent, undefined, injector);
    const containerRef = overlayRef.attach<FsDrawerComponent>(containerPortal);

    return containerRef.instance;
  }

  private attachComponent<T, R>(
    componentRef: ComponentType<T>,
    drawerContainer: FsDrawerComponent,
    overlayRef: OverlayRef,
    config: IDrawerConfig,
  ) {
    const drawerRef = new DrawerRef<T, R>(overlayRef, config);
    const injector = this.createInjector(drawerRef, config);
    const contentRef = drawerContainer.attachComponentPortal<T>(
      new ComponentPortal<T>(componentRef, undefined, injector)
    );


    // const portal = new ComponentPortal(componentRef, undefined, injector);
    // drawerRef.container = overlayRef.attach(portal);

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
