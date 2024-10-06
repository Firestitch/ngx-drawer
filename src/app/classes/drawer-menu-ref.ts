import { ComponentRef } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

import { Observable, Subject, Subscriber, zip } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsDrawerMenuComponent } from '../components/drawer-menu/drawer-menu.component';
import { DrawerData } from './drawer-data';

export class DrawerMenuRef<TCmp, R = any> {

  /** Subject for notifying the user that the menu has finished closing. */
  private readonly _afterClosed$ = new Subject<R | undefined>();

  /** Subject for notifying the user that the menu has started closing. */
  private readonly _closeStart$ = new Subject<Subscriber<void>>();

  /** Destroy notifier **/
  private readonly _destroy$ = new Subject<void>();

  /** Result to be passed to afterClosed. */
  private _result: R | undefined;

  /** Main menu component and template */
  private _externalMenuContainerRef: FsDrawerMenuComponent;

  /** Main menu component and template */
  private _externalMenuComponentRef: ComponentRef<TCmp>;


  constructor(private _overlayRef: OverlayRef, private _dataFactory: DrawerData) {
    this._overlayRef.backdropClick()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.close();
      })
  }

  /**
   * Getter for DRAWER_MENU_DATA for current drawer
   */
  get menuData() {
    return { ...this._dataFactory.getValue() } // Like immutable.... TODO switch to Immer
  }

  /**
   * Set reference to menu container
   * @param value
   */
  set containerRef(value: FsDrawerMenuComponent) {
    this._externalMenuContainerRef = value;
  }

  /**
   * Set reference to menu component
   * @param value
   */
  set componentRef(value: ComponentRef<TCmp>) {
    this._externalMenuComponentRef = value;
  }

  /**
   * Gets an observable that is notified when data in DRAWER_DATA was changed
   */
  get dataChanged$(): Observable<void> {
    return this._dataFactory.dataChange$;
  }

  /**
   * Set value for DRAWER_DATA
   * @param data
   */
  public dataChange(data) {
    this._dataFactory.setValue(data);
  }

  /**
   * Gets an observable that is notified when the drawer is finished closing.
   */
  public afterClosed(): Observable<R | undefined> {
    return this._afterClosed$.pipe(takeUntil(this._destroy$));
  }

  /**
   * Gets an observable that is notified when the drawer is finished opening.
   */
  public closeStart(): Observable<Subscriber<void>> {
    return this._closeStart$.pipe(takeUntil(this._destroy$));
  }

  /**
   * Close the menu.
   * @param result Optional result to return to the drawer opener.
   */
  public close(result?: R): void {
    new Observable<void>(observer => {
      if (this._closeStart$.observers.length) {
        zip(...this._closeStart$.observers.map((item) => {
          return Observable.create(closeObserver => {
            item.next(closeObserver);
          });
        }))
        .pipe(
          takeUntil(this._destroy$)
        )
        .subscribe(() => {
          observer.next(null);
          observer.complete();
        }, () => {
          observer.error();
        });
      } else {
        observer.next(null);
        observer.complete();
      }

    }).pipe(takeUntil(this._destroy$))
      .subscribe({
      next: () => {
        this._result = result;
        this._afterClosed$.next(result);
        this.destroy();
      }
    });
  }


  public destroy() {
    this._overlayRef.detachBackdrop();
    this._overlayRef.detach();
    this._externalMenuComponentRef && this._externalMenuComponentRef.destroy();

    this._dataFactory.destroy();

    this._destroy$.next(null);
    this._destroy$.complete();
  }


}
