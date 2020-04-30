import { Injectable, Injector, OnDestroy, Optional, SkipSelf } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType, PortalInjector } from '@angular/cdk/portal';

import { Subject, merge } from 'rxjs';
import { take, takeUntil, delay } from 'rxjs/operators';

import { FsDrawerComponent } from '../components/drawer/drawer.component';
import { DrawerRef } from '../classes/drawer-ref';
import { DrawerData } from '../classes/drawer-data';
import { IDrawerConfig } from '../interfaces/drawer-config.interface';
import { DRAWER_DATA } from './drawer-data';


@Injectable()
export class FsDrawerService implements OnDestroy {

  private _drawerRefs = new Set<DrawerRef<any>>();
  private _destroy$ = new Subject();

  constructor(
    @Optional() @SkipSelf() private _parentDrawerService: FsDrawerService,
    private _overlay: Overlay,
    private _injector: Injector) {
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public open<TData = any>(component: ComponentType<any>, config?: IDrawerConfig<TData>) {
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

    this.storeDrawerRef(drawerRef);

    merge(
      drawerRef.afterOpened$,
      drawerRef.afterClosed$
    )
    .pipe(
      takeUntil(this._destroy$)
    )
    .subscribe(() => {
      setTimeout(() => {
        this._applyBackdrop();
        this._applyBodyOpenClass();
      });
    });

    return drawerRef;
  }

  public closeAll() {
    this._drawerRefs.forEach((ref) => ref.close());

    if (this._parentDrawerService) {
      this._parentDrawerService.closeAll();
    }
  }

  private _applyBackdrop() {
    Array.from(this._drawerRefs)
    .forEach((drawerRef, index) => {;
      const backdrop = drawerRef.overlayRef.backdropElement;
      if (backdrop) {
        if (index && index === (this._drawerRefs.size - 1)) {
          backdrop.classList.add('fs-drawer-backdrop-active');
        } else {
          backdrop.classList.remove('fs-drawer-backdrop-active');
        }
      }
    });
  }

  private _applyBodyOpenClass() {
    if (Array.from(this._drawerRefs).length) {
      document.body.classList.add('fs-drawer-open');
    } else {
      document.body.classList.remove('fs-drawer-open');
    }
  }

  private storeDrawerRef(ref) {
    this._drawerRefs.add(ref);

    this.pushDrawersCascade();

    ref.destroy$
      .pipe(
        take(1),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._drawerRefs.delete(ref);
      });
  }

  /**
   * In case, when we want to open more than 1 drawer
   * our previously opened drawers should be visible
   *
   *      d1   d2   d3
   *     ---- ---- ---
   *    | x  | x1 | x2
   *    | y  | y1 | y2
   *    | z  | z1 | z2
   *     ---- ---- ---
   *
   * Where d1, d2 - previously opened drawers
   * d1 and d2 must be pushed left to be visible under just opened d3
   */
  private pushDrawersCascade() {
    if (this._drawerRefs.size > 1) {
      setTimeout(() => {
        const refsArr = Array.from(this._drawerRefs.values());

        for (let i = refsArr.length - 1; i > 0; i--) {
          const prevRef = refsArr[i - 1];
          const currRef = refsArr[i];

          prevRef.resizeController.pushMainWidth(currRef);
        }
      })
    }
  }

  private createOverlay(): OverlayRef {
    const overlayConfig = this.getOverlayConfig();
    return this._overlay.create(overlayConfig);
  }

  private getOverlayConfig(): OverlayConfig {
    return new OverlayConfig({
      hasBackdrop: true,
      backdropClass: 'fs-drawer-backdrop'
    });
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
