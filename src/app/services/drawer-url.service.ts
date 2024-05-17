import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { NavigationStart, Router, UrlTree } from '@angular/router';

import { filter } from 'rxjs/operators';

import { DrawerRef } from '../classes/drawer-ref';

import { DrawerStoreService } from './drawer-store.service';


@Injectable({
  providedIn: 'root',
})
export class FsDrawerUrlService {

  private _url: UrlTree;

  constructor(
    protected _router: Router,
    protected _location: Location,
    protected _drawerStoreService: DrawerStoreService,
  ) {
    this._initRouterEvents();
  }

  public openDrawer(drawerRef: DrawerRef<any>, url: UrlTree) {
    if (!this._url) {
      this._url = this._router.parseUrl(`${window.location.pathname}${window.location.search}`);
    }

    drawerRef.url = url;
    this._location.replaceState(drawerRef.url.toString());
  }

  public closeDrawer(drawerRef: DrawerRef<any>) {
    const topDrawerRef = this._drawerStoreService.drawerRefs
      .reverse()
      .filter((item) => drawerRef !== item && !!item.url)[0];

    if (topDrawerRef) {
      this._location.replaceState(topDrawerRef.url.toString());

    } else if (this._url) {
      this._location.replaceState(this._url.toString());
      this._url = null;
    }
  }

  private _initRouterEvents(): void {
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
      )
      .subscribe(() => {
        this._url = null;
      });
  }
}
