import {
  Component, ComponentFactoryResolver, Injector, OnDestroy, OnInit, ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';

import { ComponentType } from '@angular/cdk/portal';

import { getPathToRouteParent } from '@firestitch/core';

import { merge, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { DrawerRef } from '../../classes/drawer-ref';
import { IFsDrawerRouteConfig } from '../../interfaces/route-data.interface';
import { DrawerRouter } from '../../services/drawer-router';


@Component({
  template: '<router-outlet></router-outlet>',
})
export class FsDrawerRouteComponent implements OnInit, OnDestroy {

  private _drawer: DrawerRef<unknown, unknown>;
  private _hasActiveNavigation = false;
  private _destroy$ = new Subject<void>();

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _drawerRouter: DrawerRouter,
    private _componentFactory: ComponentFactoryResolver,
    private _injector: Injector,
    private _viewContainerRef?: ViewContainerRef,
  ) { }

  public ngOnInit(): void {
    this._listenNavigationEvents();
    this.openDrawer();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();

    this._drawer.close();
  }

  public async openDrawer(): Promise<void> {
    const drawerConfig: IFsDrawerRouteConfig = { ...this._route.snapshot.data?.fsDrawer };

    if (drawerConfig?.component) {
      this._drawer = drawerConfig.component instanceof Promise ?
        (await this._openLazyDrawer(drawerConfig)) :
        this._openDrawer(drawerConfig);

      this._listenDrawerClose();
    }
  }

  private _listenNavigationEvents(): void {
    this._router.events
      .pipe(
        filter((event) => {
          return event instanceof NavigationStart;
        }),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._hasActiveNavigation = true;
      });

    this._router.events
      .pipe(
        filter((event) => {
          return event instanceof NavigationEnd;
        }),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._hasActiveNavigation = false;
      });
  }

  private _listenDrawerClose(): void {
    merge(
      this._drawer.afterClosed$,
    )
      .pipe(
        filter(() => !this._hasActiveNavigation),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._navigateOutFromDrawer();
      });
  }

  private _navigateOutFromDrawer(): void {
    const navigationPath = getPathToRouteParent(this._route);

    // Do it!
    this._router.navigate([navigationPath], {
      relativeTo: this._route,
      queryParamsHandling: 'merge',
    });
  }

  private async _openLazyDrawer(
    drawerConfig: IFsDrawerRouteConfig,
  ): Promise<DrawerRef<unknown, unknown>> {
    const loadedComponent = await drawerConfig.component;
    const componentName = Object.keys(loadedComponent)[0];

    if (!componentName) {
      throw Error('Lazy loading drawer component error! Component not found!');
    }

    const factory = this._componentFactory.resolveComponentFactory(loadedComponent[componentName]);
    drawerConfig.component = factory.componentType;

    return this._openDrawer(drawerConfig);
  }

  private _openDrawer(routeDrawerConfig: IFsDrawerRouteConfig): DrawerRef<unknown, unknown> {
    const { component: drawerComponent, ...drawerConfig }:
      { component: ComponentType<unknown> } & any = routeDrawerConfig;

    drawerConfig.viewContainerRef = this._viewContainerRef;

    return this._drawerRouter.openDrawerForRoute(drawerComponent, drawerConfig, this._injector);
  }

}
