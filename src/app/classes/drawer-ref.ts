import { ComponentRef, ElementRef } from '@angular/core';
import { ESCAPE } from '@angular/cdk/keycodes';
import { OverlayRef } from '@angular/cdk/overlay';

import { BehaviorSubject, Observable, Subject, Subscriber, zip, pipe } from 'rxjs';
import { filter, take, takeUntil, tap, switchMap, map } from 'rxjs/operators';

import { DrawerData } from './drawer-data';
import type { FsDrawerComponent } from '../components/drawer/drawer.component';
import { DrawerConfig } from '../models/drawer-config.model';
import { DrawerMenuRef } from '../classes/drawer-menu-ref';
import { IDrawerConfig } from '../interfaces/drawer-config.interface';
import { DrawerSizeController } from './drawer-size-controller';


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

  /** Subject for notifying the user that the drawer has finished opening. */
  private readonly _actionsUpdated$ = new Subject<string>();

  /** Destroy notifier **/
  private readonly _destroy$ = new Subject<void>();

  /** Result to be passed to afterClosed. */
  private _result: R | undefined;

  /** Main drawer component and template */
  private _drawerContainerRef: FsDrawerComponent;

  /** Main drawer component and template */
  private _drawerComponentRef: ComponentRef<T>;

  /** Drawer Content Template */
  private _drawerContainer: ElementRef;

  /** Drawer Actions Template */
  private _drawerActionsContainer: ElementRef;

  private _resizeController: DrawerSizeController;

  private _activeAction = new BehaviorSubject<string>(void 0);

  private _menuRefs = new Map<string, DrawerMenuRef<T, R>>();

  private _isOpen = false;
  private _isSideOpen = false;


  constructor(
    private _overlayRef: OverlayRef,
    private _dataFactory: DrawerData,
    _config: IDrawerConfig
  ) {
    this.drawerConfig = new DrawerConfig(_config);
    this._initActiveAction();
  }

  public get overlayRef() {
    return this._overlayRef;
  }

  /**
   * Getter for DRAWER_DATA for current drawer
   */
  public get drawerData() {
    return { ...this._dataFactory.getValue() } // Like immutable.... TODO switch to Immer
  }

  public get destroy$() {
    return this._destroy$.asObservable();
  }

  /**
   * Set reference to drawer container
   * @param value
   */
  public set containerRef(value: FsDrawerComponent) {
    this._drawerContainerRef = value;
  }

  /**
   * Set reference to drawer component
   * @param value
   */
  public set componentRef(value: ComponentRef<T>) {
    this._drawerComponentRef = value;
  }

  public set drawerContainer(value: ElementRef) {
    this._drawerContainer = value;
  }

  public set drawerActionsContainer(value: ElementRef) {
    this._drawerActionsContainer = value;
  }

  public get drawerContainer(): ElementRef {
    return this._drawerContainer;
  }

  public get drawerActionsContainer(): ElementRef {
    return this._drawerActionsContainer;
  }

  public get activeAction() {
    return this._activeAction.getValue();
  }

  public get activeAction$() {
    return this._activeAction.pipe(takeUntil(this._destroy$));
  }

  /**
   * Return actual status of the drawer
   */
  public get isOpen(): boolean {
    return this._isOpen;
  }

  /**
   * Return actual status of the side of the drawer
   */
  public get isSideOpen(): boolean {
    return this._isSideOpen;
  }

  public set resizeController(value: DrawerSizeController) {
    this._resizeController = value;
  }

  public get resizeController(): DrawerSizeController {
    return this._resizeController;
  }

  /**
   * Gets an observable that action was updated and change detection should be started
   */
  public get actionUpdated$(): Observable<string> {
    return this._actionsUpdated$.pipe(takeUntil(this._destroy$));
  }

  /**
   * Gets an observable that is notified when the dialog is finished closing.
   */
  public get afterClosed$(): Observable<R | undefined> {
    return this._afterClosed$.pipe(takeUntil(this._destroy$));
  }

  /**
   * Gets an observable that is notified when the dialog is finished opening.
   */
  public get afterOpened$(): Observable<void> {
    return this._afterOpened$.pipe(takeUntil(this._destroy$));
  }

  /**
   * Gets an observable that is notified when the dialog open starts.
   */
  public get openStart$(): Observable<Subscriber<void>> {
    return this._openStart$.pipe(takeUntil(this._destroy$));
  }

  /**
   * Gets an observable that is notified when the dialog is finished opening.
   */
  public get closeStart$(): Observable<Subscriber<void>> {
    return this._closeStart$.pipe(takeUntil(this._destroy$));
  }

  public closeWhen(): any {
    return (source: Observable<T>) => {
      this._closeStart$
        .pipe(
          switchMap((observer) => {
            return source.pipe(
              map(() => {
                return observer;
              })
            );
          })
        )
        .subscribe((observer) => {
          observer.next();
          observer.complete();
        });



        //   switchMap(() => {
        //     debugger;
        //     return source;
        //   })
        // )
        // .subscribe((observer) => {
        // source.pipe(
        //   tap(() => {
        //     debugger;
        //     observer.next();
        //     observer.complete();
        //   }),
        // );


    return source;
      // return new Observable(subscriber => {
      //   source.subscribe({
      //     next(value) {
      //       if (value !== undefined && value !== null) {
      //         subscriber.next(value);
      //       }
      //     },
      //     error(error) {
      //       subscriber.error(error);
      //     },
      //     complete() {
      //       subscriber.complete();
      //     }
      //   })
      // });
    }
  }

  /**
   * Gets an observable that is notified when data in DRAWER_DATA was changed
   */
  public get dataChanged$(): Observable<any> {
    return this._dataFactory.dataChange$;
  }

  /**
   * Gets an observable that is notify that side status toggled
   */
  public get sideToggle$(): Observable<boolean> {
    return this._sideToggle.pipe(takeUntil(this._destroy$));
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
   * Set value for DRAWER_DATA
   * @param data
   */
  public dataChange(data) {
    this._dataFactory.setValue(data);
  }

  /**
   * Open drawer and notify observable
   */
  public open() {
    new Observable<void>((obs) => {
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
    new Observable<void>(observer => {
      if (this._closeStart$.observers.length) {
        zip(...this._closeStart$.observers.map(item => {
          return Observable.create(closeObserver => {
            item.next(closeObserver);
          });
        }))
        .pipe(
          takeUntil(this._destroy$)
        )
        .subscribe(() => {
          observer.next();
          observer.complete();
        }, () => {
          observer.error();
        });
      } else {
        observer.next();
        observer.complete();
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

    this.activateAction(null);
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
  public activateAction(name: string) {
    this._activeAction.next(name);

    if (name) {
      this.openSide();
    }
  }

  public enableAction(name: string): void {
    const action = this.getAction(name);

    if (action) {
      action.disabled = false;
      this._actionsUpdated$.next(name);
    }
  }

  public disableAction(name: string): void {
    const action = this.getAction(name);

    if (action) {
      action.disabled = true;
      this._actionsUpdated$.next(name);
    }
  }

  /**
   * Store opened menu reference and subscribe for auto remove
   * @param name
   * @param ref
   */
  public addMenuRef(name: string, ref: DrawerMenuRef<T, R>) {
    this._menuRefs.set(name, ref);

    ref.afterClosed()
      .pipe(
        take(1),
        takeUntil(this._destroy$)
      )
      .subscribe(() => {
        this._menuRefs.delete(name);
      })
  }

  /**
   * Get opened menu reference by name
   * @param name
   */
  public getMenuRef(name: string) {
    return this._menuRefs.get(name);
  }

  public getAction(name: string) {
    return this.drawerConfig.actions.find((action) => action.name === name);
  }

  /**
   * Do update for icon for target action
   * @param name
   * @param icon
   */
  public updateActionIcon(name: string, icon: string) {
    const action = this.getAction(name);

    if (action) {
      action.icon = icon;

      this._actionsUpdated$.next(name);
    }
  }

  /**
   * Do update
   * @param name
   * @param data
   */
  public updateAction(name: string, data) {
    const action = this.getAction(name);

    if (action) {
      const allowedFields = ['icon', 'type', 'toggle', 'tooltip', 'close', 'closeSide', 'component', 'data'];

      const forUpdate = Object.keys(data).filter((key) => allowedFields.indexOf(key) > -1);

      forUpdate.forEach((key) => {
        action[key] = data[key];
      });

      this._actionsUpdated$.next(name);
    }
  }

  public updateDrawerWidth(width: number) {
    this.resizeController.updateMainWidth(width);
  }

  public updateSideDrawerWidth(width: number) {
    this.resizeController.updateSideWidth(width);
  }

  public destroy() {
    this._overlayRef.detachBackdrop();
    this._overlayRef.detach();
    this._drawerComponentRef.destroy();
    this._dataFactory.destroy();

    this._destroy$.next();
    this._destroy$.complete();
  }

  private _initActiveAction() {
    if (this.drawerConfig.activeAction) {
      const action = this.drawerConfig.actions
        .find((a) => a.name === this.drawerConfig.activeAction);

      if (action) {
        this._activeAction.next(this.drawerConfig.activeAction);
      } else {
        console.warn(
          `Drawer active action - "${this.drawerConfig.activeAction}" does not exists
        `);
      }
    }
  }

}

