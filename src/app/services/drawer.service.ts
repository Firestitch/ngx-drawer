import { Injectable, Injector } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType, PortalInjector } from '@angular/cdk/portal';

import { FsDrawerComponent } from '../components/drawer/drawer.component';
import { DrawerRef } from '../classes/drawer-ref';
import { DrawerData } from '../classes/drawer-data';
import { IDrawerConfig } from '../interfaces/drawer-config.interface';
import { DRAWER_DATA } from './drawer-data';


@Injectable()
export class FsDrawerService {

  constructor(private _overlay: Overlay, private _injector: Injector) {
  }

  public open(component: ComponentType<any>, config?: IDrawerConfig) {
    const overlayRef = this.createOverlay();

    const dataFactory = DrawerData.createWithProxy(config.data);
    const drawerRef = new DrawerRef(overlayRef, dataFactory, config);

    const containerRef = this.attachDrawerContainer(overlayRef, drawerRef, dataFactory);
    const componentRef = this.attachComponent(component, containerRef, drawerRef, dataFactory);

    drawerRef.containerRef = containerRef;
    containerRef.setDrawerRef(drawerRef);

    drawerRef.componentRef = componentRef;

    drawerRef.events();
    drawerRef.open();

    return drawerRef;
  }

  private createOverlay(): OverlayRef {
    const overlayConfig = this.getOverlayConfig();
    return this._overlay.create(overlayConfig);
  }

  private getOverlayConfig(): OverlayConfig {
    return new OverlayConfig();
  }

  private attachDrawerContainer<T, R>(
    overlayRef: OverlayRef,
    drawerRef: DrawerRef<T, R>,
    dataFactory: DrawerData
  ) {
    const injector = this.createInjector(drawerRef, dataFactory);
    const containerPortal = new ComponentPortal(FsDrawerComponent, undefined, injector);
    const containerRef = overlayRef.attach<FsDrawerComponent>(containerPortal);

    return containerRef.instance;
  }

  private attachComponent<T, R>(
    componentRef: ComponentType<T>,
    drawerContainer: FsDrawerComponent,
    drawerRef: DrawerRef<T, R>,
    dataFactory: DrawerData,
  ) {

    const injector = this.createInjector(drawerRef, dataFactory);

    return drawerContainer.attachComponentPortal<T>(
      new ComponentPortal<T>(componentRef, undefined, injector)
    );
  }


  private createInjector(componentRef, dataFactory) {
    const injectionTokens = new WeakMap<any, any>([
      [DrawerRef, componentRef],
      [DRAWER_DATA, dataFactory]
    ]);

    return new PortalInjector(this._injector, injectionTokens);
  }


}
