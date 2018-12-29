import { ComponentRef } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

import { Observable, Subject, Subscription, Subscriber } from 'rxjs';

import { FsDrawerMenuComponent } from '../components/drawer-menu/drawer-menu.component';
import { takeUntil } from 'rxjs/operators';


export class DrawerMenuRef<T, R = any> {

  /** Subject for notifying the user that the menu has finished opening. */
  private readonly _afterOpened$ = new Subject<void>();

  /** Subject for notifying the user that the menu has finished closing. */
  private readonly _afterClosed$ = new Subject<R | undefined>();

  /** Subject for notifying the user that the menu has started closing. */
  private readonly _closeStart$ = new Subject<Subscriber<void>>();

  /** Subject for notifying the user that the menu has started opening. */
  private readonly _openStart$ = new Subject<Subscriber<void>>();

  /** Destroy notifier **/
  private readonly _destroy$ = new Subject<void>();

  /** Result to be passed to afterClosed. */
  private _result: R | undefined;

  /** Main menu component and template */
  private _externalMenuContainerRef: FsDrawerMenuComponent;

  /** Main menu component and template */
  private _externalMenuComponentRef: ComponentRef<T>;

  private _isOpen = false;

  /** Subscription of click out of menu */
  private _backdropSub: Subscription;

  constructor(private _overlayRef: OverlayRef) {
    this._backdropSub = this._overlayRef.backdropClick().subscribe(() => {
      this.close();
    })
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
  set componentRef(value: ComponentRef<T>) {
    this._externalMenuComponentRef = value;
  }

  /**
   * Return actual status of the menu
   * @returns boolean
   */
  get isOpen(): boolean {
    return this._isOpen;
  }

  /**
   * Gets an observable that is notified when the dialog is finished closing.
   */
  public afterClosed(): Observable<R | undefined> {
    return this._afterClosed$.pipe(takeUntil(this._destroy$));
  }

  /**
   * Gets an observable that is notified when the dialog is finished opening.
   */
  public afterOpened(): Observable<void> {
    return this._afterOpened$.pipe(takeUntil(this._destroy$));
  }

  /**
   * Gets an observable that is notified when the dialog open starts.
   */
  public openStart(): Observable<Subscriber<void>> {
    return this._openStart$.pipe(takeUntil(this._destroy$));
  }

  /**
   * Gets an observable that is notified when the dialog is finished opening.
   */
  public closeStart(): Observable<Subscriber<void>> {
    return this._closeStart$.pipe(takeUntil(this._destroy$));
  }

  /**
   * Open menu and notify observable
   */
  public open() {
    Observable.create((obs) => {
      setTimeout(() => { // FIXME Crutch
        if (this._openStart$.observers.length) {
          this._openStart$.next(obs);
        } else {
          obs.next();
          obs.complete();
        }
      });
    }).subscribe({
      next: () => {
        this._afterOpened$.next();
        this._afterOpened$.complete();
      },
      error: () => {
        this.destroy();
      },
    });
  }

  /**
   * Close the menu.
   * @param result Optional result to return to the dialog opener.
   */
  public close(result?: R): void {
    Observable.create((obs) => {
      if (this._closeStart$.observers.length) {
        this._closeStart$.next(obs);
      } else {
        obs.next();
        obs.complete();
      }
    }).subscribe({
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
    this._backdropSub.unsubscribe();
    this._externalMenuComponentRef && this._externalMenuComponentRef.destroy();

    this._destroy$.next();
    this._destroy$.complete();
  }


}
