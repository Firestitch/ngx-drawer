import { Injectable, Injector, Type } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { ComponentType } from '@angular/cdk/portal';

import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { DrawerRef } from '../classes/drawer-ref';
import { IDrawerConfig } from '../interfaces/drawer-config.interface';

import { FsDrawerService } from './drawer.service';


@Injectable({
  providedIn: 'root',
})
export class DrawerRouter {

  private _activeDrawer: WeakMap<Type<any>, DrawerRef<unknown>> = new WeakMap();

  private _drawerOpened$ = new BehaviorSubject<void>(null);

  constructor(
    private _router: Router,
    private _drawer: FsDrawerService,
  ) {
  }

  public openDrawerForRoute(
    component: ComponentType<unknown>,
    config: IDrawerConfig,
    injector: Injector,
  ): DrawerRef<unknown, unknown> {
    const drawer = this.openDrawer(component, config, injector);

    this._registerDrawer(component, drawer);

    return drawer;
  }

  public navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
    return this._router.navigate(commands, extras);
  }

  public openDrawer<T = any, TR = any>(
    component: ComponentType<T>,
    config?: IDrawerConfig,
    injector?: Injector,
  ): DrawerRef<T, TR> {
    const drawer = this._drawer.open(component, config, injector);

    this._registerDrawer(component, drawer);

    return drawer as any;
  }

  public drawerRef$(component: Type<any>): Observable<DrawerRef<any>> {
    return this._drawerOpened$
      .pipe(
        filter(() => {
          return this._activeDrawer.has(component);
        }),
        map(() => this._activeDrawer.get(component)),
      );
  }

  private _registerDrawer(component: Type<any>, ref: DrawerRef<unknown, unknown>): void {
    if (!this._activeDrawer.has(component)) {
      this._activeDrawer.set(component, ref);

      this._listenDrawerClose(component, ref);

      this._drawerOpened$.next(null);
    }
  }

  private _listenDrawerClose(component: Type<any>, ref: DrawerRef<unknown, unknown>): void {
    ref.afterClosed$
      .pipe(
        take(1),
      )
      .subscribe(() => {
        this._activeDrawer.delete(component);
      });

  }
}
