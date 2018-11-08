import { ESCAPE } from '@angular/cdk/keycodes';
import { OverlayRef } from '@angular/cdk/overlay';

import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { FsDrawerComponent } from '../components';
import { ComponentRef } from '@angular/core';
import { DrawerConfig } from '../models/fs-drawer-config.model';


export class DrawerRef<T, R = any> {

  public readonly drawerConfig;

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

  /** Target component */
  private _container;

  /** Main drawer component and template */
  private _drawerContainerRef: FsDrawerComponent;

  /** Main drawer component and template */
  private _drawerComponentRef: ComponentRef<T>;

  constructor(private _overlayRef: OverlayRef,
              _config: any) {
    this.drawerConfig = new DrawerConfig(_config);
  }

  /**
   * Set main target component
   * @param value
   */
  set container(value) {
    this._container = value;
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

  /**
   * Subscribe on keydown events to react on escape
   */
  public events() {
    this._overlayRef.keydownEvents()
      .pipe(filter(event => event.keyCode === ESCAPE && !this._drawerContainerRef.drawerConfig))
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
    this._drawerContainerRef.openSide();
  }

  /**
   * Close the side of the drawer
   */
  public closeSide() {
    this._drawerContainerRef.closeSide();
  }

  /**
   * Toggle the side of the drawer
   */
  public toggleSide() {
    const drawer = this._drawerContainerRef;
    drawer.isOpenSide ? drawer.closeSide() : drawer.openSide();
  }

  /**
   * Return actual status of the drawer
   * @returns {boolean}
   */
  public isOpen(): boolean {
    return this._drawerContainerRef.isOpen;
  }

  /**
   * Return actual status of the side of the drawer
   * @returns {boolean}
   */
  public isSideOpen(): boolean {
    return this._drawerContainerRef.isOpenSide;
  }

  /**
   * Change active action
   * @param {string} name
   */
  public setActiveAction(name: string) {
    this._drawerContainerRef.drawerConfig.activeAction = name;
  }


}

