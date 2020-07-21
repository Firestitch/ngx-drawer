import { Inject, Injectable, Injector, OnDestroy, Optional, SkipSelf } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType, PortalInjector } from '@angular/cdk/portal';

import { Subject, merge } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { merge as _merge } from 'lodash-es';
import { FsDrawerComponent } from '../components/drawer/drawer.component';
import { DrawerRef } from '../classes/drawer-ref';
import { DrawerData } from '../classes/drawer-data';
import { IDrawerConfig } from '../interfaces/drawer-config.interface';
import { DRAWER_DATA } from './drawer-data';
import { DrawerStoreService } from './drawer-store.service';
import { DRAWER_DEFAULT_CONFIG } from './drawer-default-config';


@Injectable({
  providedIn: 'root',
})
export class FsDrawerService implements OnDestroy {

  private _destroy$ = new Subject();

  constructor(
    @Optional() @SkipSelf() private _parentDrawerService: FsDrawerService,
    @Optional() @Inject(DRAWER_DEFAULT_CONFIG) private _defaultConfig,
    private _overlay: Overlay,
    private _injector: Injector,
    private _drawerStore: DrawerStoreService,
  ) {}

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public open<TData = any>(component: ComponentType<any>, config?: IDrawerConfig<TData>) {
    const overlayRef = this._createOverlay();

    const dataFactory = DrawerData.createWithProxy(config.data);

    delete config.data;
    config = _merge(this._defaultConfig || {}, config);

    const drawerRef = new DrawerRef(overlayRef, dataFactory, config);

    const containerRef = this._attachDrawerContainer(overlayRef, drawerRef, dataFactory);
    const componentRef = this._attachComponent(component, containerRef, drawerRef, dataFactory);

    drawerRef.containerRef = containerRef;
    containerRef.setDrawerRef(drawerRef);

    drawerRef.componentRef = componentRef;

    drawerRef.events();
    drawerRef.open();

    this._storeDrawerRef(drawerRef);

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
    this._drawerStore.drawerRefs
      .forEach((ref) => ref.close());

    if (this._parentDrawerService) {
      this._parentDrawerService.closeAll();
    }
  }

  private _applyBackdrop() {
    Array.from(this._drawerStore.drawerRefs)
      .forEach((drawerRef, index) => {
        const backdrop = drawerRef.overlayRef.backdropElement;

        if (backdrop) {
          if (index && index === (this._drawerStore.numberOfOpenedDrawers - 1)) {
            backdrop.classList.add('fs-drawer-backdrop-active');
          } else {
            backdrop.classList.remove('fs-drawer-backdrop-active');
          }
        }
      });
  }

  private _applyBodyOpenClass() {
    if (this._drawerStore.numberOfOpenedDrawers) {
      document.body.classList.add('fs-drawer-open');
    } else {
      document.body.classList.remove('fs-drawer-open');
    }
  }

  private _storeDrawerRef(ref) {
    this._drawerStore.addRef(ref);

    ref.destroy$
      .pipe(
        take(1),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._drawerStore.deleteRef(ref);
      });
  }

  private _createOverlay(): OverlayRef {
    const overlayConfig = this._getOverlayConfig();
    return this._overlay.create(overlayConfig);
  }

  private _getOverlayConfig(): OverlayConfig {
    return new OverlayConfig({
      hasBackdrop: true,
      backdropClass: 'fs-drawer-backdrop'
    });
  }

  private _attachDrawerContainer<T, R>(
    overlayRef: OverlayRef,
    drawerRef: DrawerRef<T, R>,
    dataFactory: DrawerData
  ) {
    const injector = this._createInjector(drawerRef, dataFactory);
    const containerPortal = new ComponentPortal(FsDrawerComponent, undefined, injector);
    const containerRef = overlayRef.attach<FsDrawerComponent>(containerPortal);

    return containerRef.instance;
  }

  private _attachComponent<T, R>(
    componentRef: ComponentType<T>,
    drawerContainer: FsDrawerComponent,
    drawerRef: DrawerRef<T, R>,
    dataFactory: DrawerData,
  ) {

    const injector = this._createInjector(drawerRef, dataFactory);

    return drawerContainer.attachComponentPortal<T>(
      new ComponentPortal<T>(componentRef, undefined, injector)
    );
  }


  private _createInjector(componentRef, dataFactory) {
    const injectionTokens = new WeakMap<any, any>([
      [DrawerRef, componentRef],
      [DRAWER_DATA, dataFactory]
    ]);

    return new PortalInjector(this._injector, injectionTokens);
  }


}
