import { Injectable, NgZone, OnDestroy } from '@angular/core';

import { fromEvent, Subject } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';

import { DrawerRef } from '../classes/drawer-ref';
import { FsDrawerResizerDirective } from '../directives/drawer-resizer.directive';
import { IDrawerWidthDefinition } from '../interfaces/drawer-config.interface';
import { FsDrawerPersistanceController } from './persistance-controller';

const MAIN_DRAWER_DEFAULT_WIDTH = 500;
const SIDE_DRAWER_DEFAULT_WIDTH = 200;
const SIDE_RESIZE_BAR_WIDTH = 25;
const MAIN_RESIZE_ACTION_BAR_WIDTH = 40;

@Injectable()
export class DrawerSizeController implements OnDestroy {

  private _mainElRef: FsDrawerResizerDirective;
  private _sideElRef: FsDrawerResizerDirective;

  private _mainConfig: IDrawerWidthDefinition;
  private _sideConfig: IDrawerWidthDefinition;

  private _sideOpened = false;
  private _screenWidth: number;

  private readonly _borderPadding = 0;

  private _destroy$ = new Subject<void>();

  constructor(
    private _drawerRef: DrawerRef<any>,
    private _ngZone: NgZone,
    private _persistanceController: FsDrawerPersistanceController,
  ) {}

  public get mainElRef() {
    return this._mainElRef;
  }

  public get sideElRef() {
    return this._sideElRef;
  }

  public get mainConfig(): IDrawerWidthDefinition {
    return this._mainConfig;
  }

  public get sideConfig(): IDrawerWidthDefinition {
    return this._sideConfig;
  }

  public get screenWidth(): number {
    return this._screenWidth;
  }

  private get persistedMainWidth(): number {
    return this._persistanceController.enabled
      ? this._persistanceController.getDataFromScope('mainWidth')
      : null;
  }

  private get persistedSideWidth(): number {
    return this._persistanceController.enabled
      ? this._persistanceController.getDataFromScope('sideWidth')
      : null;
  }

  public init(): void {
    this._initDefaultConfigs();
    this._updateScreenWidth();
    this._listenWindowResize();
    this._listenSideToggle();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public registerElRef(el: FsDrawerResizerDirective) {
    if (el.isMainDrawer) {
      this._registerMainRef(el);
      this._listenWidthChanges(el);
    } else if (el.isSideDrawer) {
      this._registerSideRef(el);
      this._listenWidthChanges(el);
    } else {
      throw Error('Unrecognized resize element type')
    }
  }

  public removeElRef(el: FsDrawerResizerDirective) {
    if (el.isMainDrawer) {
      this._removeMainRef();
    } else if (el.isSideDrawer) {
      this._removeSideRef();
    }
  }

  public getInitialWidth(type: 'main' | 'side'): number {
    if (type === 'main') {
      return this.mainConfig.initial;
    } else if (type === 'side') {
      return this.sideConfig.initial;
    } else {
      return void 0;
    }
  }

  public getMinWidth(type: 'main' | 'side'): number {
    if (type === 'main') {
      return this.mainConfig.min;
    } else if (type === 'side') {
      return this.sideConfig.min;
    } else {
      return void 0;
    }
  }

  public getMaxWidth(type: 'main' | 'side'): number {
    if (type === 'main') {
      return this.mainConfig.max;
    } else if (type === 'side') {
      return this.sideConfig.max;
    } else {
      return void 0;
    }
  }

  /**
   * Update width from outside with all calculations to be done
   * @param width
   */
  public updateMainWidth(width: number) {
    const sideWidth = (this.sideElRef && this.sideElRef.width) || 0;
    this.mainElRef.updateWidth(sideWidth + width);
  }

  /**
   * Update width from outside with all calculations to be done
   * @param width
   */
  public updateSideWidth(width: number) {
    if (this.sideElRef) {
      const currentWidth = this.mainElRef.width - this.sideElRef.width;
      this.mainElRef.updateWidth(currentWidth + width);
      this.sideElRef.updateWidth(width);
    }
  }

  /**
   * Push current drawer to be visible under new one opened
   * @param inFrontDrawer
   */
  public pushMainWidth(inFrontDrawer: DrawerRef<any>) {
    const inFrontDrawerTotalWidth = inFrontDrawer.resizeController.mainElRef.width + MAIN_RESIZE_ACTION_BAR_WIDTH;

    if (this.mainElRef.width <= inFrontDrawerTotalWidth) {
      this.updateMainWidth(inFrontDrawerTotalWidth);
    }
  }

  /**
   * Listen for browser resize and update restrictions
   */
  private _listenWindowResize() {
    this._ngZone.runOutsideAngular(() => {
      fromEvent(window, 'resize')
        .pipe(
          debounceTime(50),
          takeUntil(this._destroy$),
        )
        .subscribe(() => {
          this._updateScreenWidth();
          this._updateMinMaxStyles();
        });
    });
  }

  /**
   * Copy initial configs or set default values
   */
  private _initDefaultConfigs() {
    // Main initialization
    this._mainConfig =
      (this._drawerRef.drawerConfig.width && this._drawerRef.drawerConfig.width.main)
      || {};

    this._mainConfig.initial = this.persistedMainWidth
      || this._mainConfig.initial
      || MAIN_DRAWER_DEFAULT_WIDTH;


    // Side initialization
    this._sideConfig =
      (this._drawerRef.drawerConfig.width && this._drawerRef.drawerConfig.width.side)
      || {};

    this._sideConfig.initial = this.persistedSideWidth
      || this._sideConfig.initial
      || SIDE_DRAWER_DEFAULT_WIDTH;
  }

  private _registerMainRef(el: FsDrawerResizerDirective) {
    this._mainElRef = el;
  }

  private _registerSideRef(el: FsDrawerResizerDirective) {
    this._sideElRef = el;
  }

  private _removeMainRef() {
    this._mainElRef = null;
  }

  private _removeSideRef() {
    this._sideElRef = null;
  }

  /**
   * Update current window size
   */
  private _updateScreenWidth(): void {
    this._screenWidth = (window.innerWidth - this._borderPadding);
  }

  /**
   * Update min&max css props for containers
   */
  private _updateMinMaxStyles(): void {
    this.mainElRef.setMinMaxStyles();

    if (this.sideElRef) {
      this.sideElRef.setMinMaxStyles();
    }
  }

  private _listenSideToggle(): void {
    this._drawerRef.sideToggle$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((opened: boolean) => {
        if (this._sideOpened === opened) {
          return;
        }

        this._sideOpened = opened;

        if (opened) {
          const currentWidth = this.mainElRef.width;
          const sideWidth = this.getInitialWidth('side');

          this._mainElRef.updateWidth(currentWidth + sideWidth + SIDE_RESIZE_BAR_WIDTH);
        } else {
          const actualSideWidth = this.sideElRef.fsDrawerResizer.getBoundingClientRect().width;
          const mainWidth = this.mainElRef.width - actualSideWidth - SIDE_RESIZE_BAR_WIDTH;

          this._mainElRef.updateWidth(mainWidth);
        }
      })
  }

  private _listenWidthChanges(el: FsDrawerResizerDirective) {
    if (!this._persistanceController.enabled) {
      return;
    }

    el.width$
      .pipe(
        debounceTime(200),
      )
      .subscribe({
        next: () => {
          const sideWidth = this._sideElRef?.width || 0;

          if (this._mainElRef) {
            this._persistanceController.saveDataToScope(
              'mainWidth',
              this._mainElRef.width - sideWidth
            );
          }

          if (this._sideElRef) {
            this._persistanceController.saveDataToScope(
              'sideWidth',
              sideWidth
            );
          }
        }
      })
  }
}
