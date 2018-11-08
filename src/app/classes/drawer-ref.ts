import { ComponentRef } from '@angular/core';
import { ESCAPE } from '@angular/cdk/keycodes';
import { OverlayRef } from '@angular/cdk/overlay';

import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { FsDrawerComponent } from '../components';
import { DrawerConfig } from '../models/fs-drawer-config.model';


export class DrawerRef<T, R = any> {

  public readonly drawerConfig: DrawerConfig;

  /** Subject for notifying the user that the drawer has finished opening. */
  private readonly _afterOpened = new Subject<void>();

  /** Subject for notifying the user that the drawer has finished closing. */
  private readonly _afterClosed = new Subject<R | undefined>();

  /** Subject for notifying the user that the drawer has started closing. */
  private readonly _closeStart = new Subject<void>();

  /** Subject for notifying the user that the drawer has started opening. */
  private readonly _openStart = new Subject<void>();

  /** Result to be passed to afterClosed. */
  private _result: R | undefined;

  /** Main drawer component and template */
  private _drawerContainerRef: FsDrawerComponent;

  /** Main drawer component and template */
  private _drawerComponentRef: ComponentRef<T>;

  private _activeAction: string;

  private _isOpen = false;
  private _isSideOpen = false;


  constructor(
    private _overlayRef: OverlayRef,
              _config: any
  ) {
    this.drawerConfig = new DrawerConfig(_config);
  }

  /**
   * Set reference to drawer container
   * @param {FsDrawerComponent} value
   */
  set containerRef(value: FsDrawerComponent) {
    this._drawerContainerRef = value;
  }

  /**
   * Set reference to drawer component
   * @param {ComponentRef<T>} value
   */
  set componentRef(value: ComponentRef<T>) {
    this._drawerComponentRef = value;
  }

  get activeAction() {
    return this._activeAction;
  }

  /**
   * Return actual status of the drawer
   * @returns {boolean}
   */
  get isOpen(): boolean {
    return this._isOpen;
  }

  /**
   * Return actual status of the side of the drawer
   * @returns {boolean}
   */
  get isSideOpen(): boolean {
    return this._isSideOpen;
  }

  /**
   * Subscribe on keydown events to react on escape
   */
  public events() {
    this._overlayRef.keydownEvents()
      .pipe(filter(event => event.keyCode === ESCAPE && !this.drawerConfig.disableClose))
      .subscribe(() => this.close());
  }

  /**
   * Gets an observable that is notified when the dialog is finished closing.
   */
  public afterClosed(): Observable<R | undefined> {
    return this._afterClosed.asObservable();
  }

  /**
   * Gets an observable that is notified when the dialog is finished opening.
   */
  public afterOpened(): Observable<void> {
    return this._afterOpened.asObservable();
  }

  /**
   * Open drawer and notify observable
   */
  public open() {
    this._drawerContainerRef.open();
    this._afterOpened.next();
    this._afterOpened.complete();
  }

  /**
   * Close the drawer.
   * @param result Optional result to return to the dialog opener.
   */
  public close(result?: R): void {
    this._drawerContainerRef.close();
    this._result = result;

    this._afterClosed.next(result);
    this._afterClosed.complete();
    this._overlayRef.detachBackdrop();
  }

  /**
   * Open the side of the drawer
   */
  public openSide() {
    this._isSideOpen = true;
  }

  /**
   * Close the side of the drawer
   */
  public closeSide() {
    this._activeAction = null;
    this._isSideOpen = false;
  }

  /**
   * Toggle the side of the drawer
   */
  public toggleSide() {
    this.isSideOpen ? this.closeSide() : this.openSide();
  }

  /**
   * Change active action
   * @param {string} name
   */
  public setActiveAction(name: string) {
    this._activeAction = name;
    this.openSide();
  }


}

