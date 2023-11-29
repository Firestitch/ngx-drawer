import { Injectable } from '@angular/core';

import { ComponentType } from '@angular/cdk/portal';

import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { DrawerRef } from '../classes/drawer-ref';


@Injectable({
  providedIn: 'root',
})
export class DrawerStoreService {

  private _openedDrawers: DrawerRef<any>[] = [];
  private _openedDrawersMap = new WeakMap<ComponentType<unknown>, DrawerRef<unknown>>();
  private _drawerOpened$ = new BehaviorSubject<void>(null);

  public get drawerRefs(): DrawerRef<any>[] {
    return [...this._openedDrawers];
  }

  public get numberOfOpenedDrawers(): number {
    return this._openedDrawers.length;
  }

  public getLevelForRef(value: DrawerRef<any>): number {
    return this._openedDrawers.indexOf(value) + 1;
  }

  public addRef(componentRef: ComponentType<unknown>, value: DrawerRef<any>): void {
    if (this._openedDrawers.indexOf(value) === -1) {
      this._openedDrawers.push(value);
      this._openedDrawersMap.set(componentRef, value);
      this._drawerOpened$.next();

      this._pushDrawersCascade();
    }
  }

  public deleteRef(component: ComponentType<unknown>, value: DrawerRef<any>): void {
    this._openedDrawers = this._openedDrawers
      .filter((ref) => ref !== value);

    this._openedDrawersMap.delete(component);
  }

  public dialogRef$(component: ComponentType<unknown>): Observable<DrawerRef<any>> {
    return this._drawerOpened$
      .pipe(
        filter(() => {
          return this._openedDrawersMap.has(component);
        }),
        map(() => this._openedDrawersMap.get(component)),
      );
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
  private _pushDrawersCascade(): void {
    if (this.numberOfOpenedDrawers > 1) {
      // SetTimeout should be here because we must wait render newly opened drawer
      // to be able to get his width
      setTimeout(() => {
        const refsArr = Array.from(this._openedDrawers.values());

        for (let i = refsArr.length - 1; i > 0; i--) {
          const prevRef = refsArr[i - 1];
          const currRef = refsArr[i];

          prevRef.resizeController.pushMainWidth(currRef);
        }
      });
    }
  }
}
