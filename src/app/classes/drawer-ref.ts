import { ComponentRef, ElementRef } from '@angular/core';
import { ESCAPE } from '@angular/cdk/keycodes';
import { OverlayRef } from '@angular/cdk/overlay';

import { Observable, Subject, Subscriber } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { FsDrawerComponent } from '../components/drawer/drawer.component';
import { DrawerConfig } from '../models/drawer-config.model';
import { DrawerData } from './drawer-data';


export class DrawerRef<T, R = any> {

  public readonly drawerConfig: DrawerConfig;

  /** Subject for notifying the user that the drawer has finished opening. */
  private readonly _afterOpened$ = new Subject<void>();

  /** Subject for notifying the user that the drawer has finished closing. */
  private readonly _afterClosed$ = new Subject<R | undefined>();

  /** Subject for notifying the user that the drawer has started closing. */
  private readonly _closeStart$ = new Subject<Subscriber<void>>();

  /** Subject for notifying the user that the drawer has started opening. */
  private readonly _openStart$ = new Subject<Subscriber<void>>();

  /** Subject for notifying the user that the drawer has started closing. */
  private readonly _sideToggle = new Subject<boolean>();

  /** Subject for notifying the user that the drawer has started opening. */
  private readonly _activeActionChange$ = new Subject<{ old: string, current: string }>();

  /** Destroy notifier **/
  private readonly _destroy$ = new Subject<void>();

  /** Result to be passed to afterClosed. */
  private _result: R | undefined;

  /** Main drawer component and template */
  private _drawerContainerRef: FsDrawerComponent;

  /** Main drawer component and template */
  private _drawerComponentRef: ComponentRef<T>;

  /** Drawer Content Template */
  private _drawerContentContainer: ElementRef;

  /** Drawer Actions Template */
  private _drawerActionsContainer: ElementRef;

  private _activeAction: string = null;

  private _isOpen = false;
  private _isSideOpen = false;


  constructor(
    private _overlayRef: OverlayRef,
    private _dataFactory: DrawerData,
    _config: any) {
    this.drawerConfig = new DrawerConfig(_config);

    this._activeAction = this.drawerConfig.activeAction;
  }

  /**
   * Getter for DRAWER_DATA for current drawer
   */
  get drawerData() {
    return { ...this._dataFactory.value } // Like immutable.... TODO switch to Immer
  }

  /**
   * Set reference to drawer container
   * @param value
   */
  set containerRef(value: FsDrawerComponent) {
    this._drawerContainerRef = value;
  }

  /**
   * Set reference to drawer component
   * @param value
   */
  set componentRef(value: ComponentRef<T>) {
    this._drawerComponentRef = value;
  }

  set drawerContentContainer(value: ElementRef) {
    this._drawerContentContainer = value;
  }

  set drawerActionsContainer(value: ElementRef) {
    this._drawerActionsContainer = value;
  }

  get drawerContentContainer(): ElementRef {
    return this._drawerContentContainer;
  }

  get drawerActionsContainer(): ElementRef {
    return this._drawerActionsContainer;
  }

  get activeAction() {
    return this._activeAction;
  }

  /**
   * Return actual status of the drawer
   */
  get isOpen(): boolean {
    return this._isOpen;
  }

  /**
   * Return actual status of the side of the drawer
   */
  get isSideOpen(): boolean {
    return this._isSideOpen;
  }

  /**
   * Subscribe on keydown events to react on escape
   */
  public events() {
    this._overlayRef.keydownEvents()
      .pipe(
        filter(event => event.keyCode === ESCAPE && !this.drawerConfig.disableClose),
        takeUntil(this._destroy$),
      )
      .subscribe(() => this.close());
  }

  /**
   * Event provides change of active action
   */
  public activeActionChange() {
    return this._activeActionChange$.pipe(takeUntil(this._destroy$));
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
   * Gets an observable that is notified when data in DRAWER_DATA was changed
   */
  public dataChange(): Observable<void> {
    return this._dataFactory.dataChange$;
  }

  /**
   * Gets an observable that is notify that side status toggled
   */
  public sideToggle(): Observable<boolean> {
    return this._sideToggle.pipe(takeUntil(this._destroy$));
  }

  /**
   * Open drawer and notify observable
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
    }).pipe(takeUntil(this._destroy$))
      .subscribe({
        next: () => {
          if (this.activeAction) {
            this.openSide();
          }

          this._drawerContainerRef.open();
          this._afterOpened$.next();
          this._afterOpened$.complete();
        },
        error: () => {
          this.destroy();
        },
    });
  }

  /**
   * Close the drawer.
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
    }).pipe(takeUntil(this._destroy$))
      .subscribe({
      next: () => {
        this._drawerContainerRef.close();
        this._result = result;

        this._afterClosed$.next(result);

        this.destroy();
      }
    });
  }

  /**
   * Open the side of the drawer
   */
  public openSide() {
    this._isSideOpen = true;
    this._sideToggle.next(this._isSideOpen);
  }

  /**
   * Close the side of the drawer
   */
  public closeSide() {
    this._isSideOpen = false;
    this._sideToggle.next(this._isSideOpen);

    this.setActiveAction(null);
  }

  /**
   * Toggle the side of the drawer
   */
  public toggleSide() {
    this.isSideOpen ? this.closeSide() : this.openSide();
  }

  /**
   * Change active action
   * @param name
   */
  public setActiveAction(name: string) {
    const activeAction = this._activeAction;

    this._activeAction = name;

    if (name) {
      this.openSide();
    }

    this._activeActionChange$.next({ old: activeAction, current: this._activeAction });
  }

  /**
   * Do immutable update of drawerDataa
   * @param data
   */
  public updateDrawerData(data: any) {
    this._dataFactory.value = data;
  }

  public destroy() {
    this._overlayRef.detachBackdrop();
    this._overlayRef.detach();
    this._drawerComponentRef.destroy();
    this._dataFactory.destroy();

    this._destroy$.next();
    this._destroy$.complete();
  }


}

