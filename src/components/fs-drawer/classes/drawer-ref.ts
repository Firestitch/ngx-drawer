import { ESCAPE } from '@angular/cdk/keycodes';
import { Observable, Subject } from 'rxjs/Rx';

import { OverlayRef } from '@angular/cdk/overlay';
import { filter } from 'rxjs/internal/operators';
import { FsDrawerComponent } from '../fs-drawer.component';

export class DrawerRef<T, R = any> {

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
  private _drawerComponent: FsDrawerComponent;

  constructor(private _overlayRef: OverlayRef,
              private _config: any) {
  }

  /**
   * Set main target component
   * @param value
   */
  set container(value) {
    this._container = value;
  }

  /**
   * Set drawer template and open the drawer
   * @param {FsDrawerComponent} value
   */
  set template(value: FsDrawerComponent) {
    this._drawerComponent = value;
    this.events();
    this.open();
  }

  /**
   * Subscribe on keydown events to react on escape
   */
  public events() {
    this._overlayRef.keydownEvents()
      .pipe(filter(event => event.keyCode === ESCAPE && !this._drawerComponent.drawerConfig))
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
    this._drawerComponent.open();
    this._afterOpened.next();
    this._afterOpened.complete();
  }

  /**
   * Close the drawer.
   * @param result Optional result to return to the dialog opener.
   */
  public close(result?: R): void {
    this._drawerComponent.close();
    this._result = result;

    this._afterClosed.next(result);
    this._afterClosed.complete();
    this._overlayRef.detachBackdrop();
  }

  /**
   * Open the side of the drawer
   */
  public openSide() {
    this._drawerComponent.openSide();
  }

  /**
   * Close the side of the drawer
   */
  public closeSide() {
    this._drawerComponent.closeSide();
  }

  /**
   * Toggle the side of the drawer
   */
  public toggleSide() {
    const drawer = this._drawerComponent;
    drawer.isOpenSide ? drawer.closeSide() : drawer.openSide();
  }

  /**
   * Return actual status of the drawer
   * @returns {boolean}
   */
  public isOpen(): boolean {
    return this._drawerComponent.isOpen;
  }

  /**
   * Return actual status of the side of the drawer
   * @returns {boolean}
   */
  public isSideOpen(): boolean {
    return this._drawerComponent.isOpenSide;
  }

  /**
   * Change active action
   * @param {string} name
   */
  public setActiveAction(name: string) {
    this._drawerComponent.drawerConfig.activeAction = name;
  }


}

