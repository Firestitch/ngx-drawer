import { Injectable, InjectionToken, Injector } from '@angular/core';
import { Overlay, OverlayConfig, OverlayContainer, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType, PortalInjector } from '@angular/cdk/portal';

import { FsDrawerComponent } from '../components/fs-drawer/fs-drawer.component';
import { DrawerRef } from '../classes';
import { IDrawerConfig } from '../interfaces';
import { DRAWER_DATA } from './drawer-data';
import { DrawerConfig } from '../models/fs-drawer-config.model';


@Injectable()
export class FsDrawerService {

  constructor(private _overlay: Overlay,
              private _injector: Injector,
              private _overlayContainer: OverlayContainer) {
  }

  public open(component: ComponentType<any>, config?: IDrawerConfig) {
    const overlayRef = this.createOverlay(config.data);

    const drawerRef = new DrawerRef(overlayRef, config);


    const containerRef = this.attachDrawerContainer(overlayRef, config);
    const componentRef = this.attachComponent(component, containerRef, drawerRef, config);

    drawerRef.containerRef = containerRef;
    containerRef.setDrawerRef(drawerRef);

    drawerRef.componentRef = componentRef;

    drawerRef.events();
    drawerRef.open();

    return drawerRef;
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
    drawerRef: DrawerRef<T, R>,
    config: IDrawerConfig,
  ) {

    const injector = this.createInjector(drawerRef, config);

    return drawerContainer.attachComponentPortal<T>(
      new ComponentPortal<T>(componentRef, undefined, injector)
    );
  }


  private createInjector(componentRef, config) {
    const injectionTokens = new WeakMap<any, any>([
      [DrawerRef, componentRef],
      [DRAWER_DATA, config.data]
    ]);

    return new PortalInjector(this._injector, injectionTokens);
  }


}
