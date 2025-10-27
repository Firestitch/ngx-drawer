import { Injectable, NgZone, OnDestroy, inject } from '@angular/core';

import { fromEvent, Subject } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';

import { DrawerRef } from '../classes/drawer-ref';
import {
  CONTENT_DRAWER_DEFAULT_WIDTH,
  MAIN_DRAWER_DEFAULT_WIDTH,
  MAIN_RESIZE_ACTION_BAR_WIDTH,
  SIDE_DRAWER_DEFAULT_WIDTH, SIDE_RESIZE_BAR_WIDTH,
} from '../consts/sizes.cont';
import { FsDrawerResizerDirective } from '../directives/drawer-resizer.directive';
import { IDrawerWidthDefinition } from '../interfaces/drawer-config.interface';
import { DrawerStoreService } from '../services/drawer-store.service';

import { FsDrawerPersistanceController } from './persistance-controller';


@Injectable()
export class DrawerSizeController implements OnDestroy {
  private _drawerRef = inject<DrawerRef<any>>(DrawerRef);
  private _ngZone = inject(NgZone);
  private _persistanceController = inject(FsDrawerPersistanceController);
  private _drawerStore = inject(DrawerStoreService);


  private _mainElRef: FsDrawerResizerDirective;
  private _sideElRef: FsDrawerResizerDirective;

  private _mainConfig: IDrawerWidthDefinition;
  private _sideConfig: IDrawerWidthDefinition;
  private _contentConfig: Omit<IDrawerWidthDefinition, 'initial' | 'max'>;

  private _sideOpened = false;
  private _screenWidth: number;

  private readonly _borderPadding = 0;

  private _destroy$ = new Subject<void>();

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

  public get contentConfig(): IDrawerWidthDefinition {
    return this._contentConfig;
  }

  public get screenWidth(): number {
    return this._screenWidth;
  }

  public get persistedMainWidth(): number {
    return this._persistanceController.enabled
      ? this._persistanceController.getDataFromScope('mainWidth')
      : null;
  }

  public get persistedSideWidth(): number {
    return this._persistanceController.enabled
      ? this._persistanceController.getDataFromScope('sideWidth')
      : null;
  }

  public get persistedContentWidth(): number {
    return this._persistanceController.enabled
      ? this._persistanceController.getDataFromScope('contentWidth')
      : null;
  }

  public init(): void {
    this._initDefaultConfigs();
    this._updateScreenWidth();
    this._listenWindowResize();
    this._listenSideToggle();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
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
      throw Error('Unrecognized resize element type');
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
    }

    return undefined;

  }

  public getMinWidth(type: 'main' | 'side'): number {
    if (type === 'main') {
      return this.mainConfig.min ?? 0;
    } else if (type === 'side') {
      return this.sideConfig.min ?? 0;
    }

    return 0;

  }

  public getMaxWidth(type: 'main' | 'side'): number {
    if (type === 'main') {
      return this.mainConfig.max ?? window.innerWidth;
    } else if (type === 'side') {
      const availableSideWidth = this.mainElRef.width - MAIN_RESIZE_ACTION_BAR_WIDTH - SIDE_RESIZE_BAR_WIDTH;

      const sideMax = this.sideConfig.max ?? availableSideWidth;

      const minContentWidth
        = availableSideWidth - (this.contentConfig.min ?? 0);

      return Math.min(sideMax, minContentWidth);
    }

    return window.innerWidth;

  }

  /**
   * Update width from outside with all calculations to be done
   *
   * @param width
   */
  public updateMainWidth(width: number) {
    const sideWidth = (this.sideElRef && this.sideElRef.width) || 0;
    this.mainElRef.updateWidth(sideWidth + width);
  }

  /**
   * Update width from outside with all calculations to be done
   *
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
   *
   * @param inFrontDrawer
   */
  public pushMainWidth(inFrontDrawer: DrawerRef<any>) {
    const inFrontDrawerTotalWidth = inFrontDrawer.resizeController.mainElRef.width
      + MAIN_RESIZE_ACTION_BAR_WIDTH;

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
      (this._drawerRef.drawerConfig.width?.main)
      || {};

    this._mainConfig.initial = this.persistedMainWidth
      || this._mainConfig.initial
      || MAIN_DRAWER_DEFAULT_WIDTH;


    // Side initialization
    this._sideConfig =
      (this._drawerRef.drawerConfig.width?.side)
      || {};

    this._sideConfig.initial = this.persistedSideWidth
      || this._sideConfig.initial
      || SIDE_DRAWER_DEFAULT_WIDTH;

    // Content initialization
    this._contentConfig =
      (this._drawerRef.drawerConfig.width?.content)
      || {};
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
      });
  }

  private _listenWidthChanges(el: FsDrawerResizerDirective) {
    if (!this._persistanceController.enabled) {
      return;
    }

    el.width$
      .pipe(
        debounceTime(200),
        filter(() => {
          return this._drawerStore.getLevelForRef(el.drawerRef) === this._drawerStore.numberOfOpenedDrawers;
        }),
      )
      .subscribe({
        next: () => {
          const sideWidth = this._sideElRef?.width || 0;

          if (this._mainElRef) {
            this._persistanceController.saveDataToScope(
              'mainWidth',
              this._mainElRef.width - sideWidth - SIDE_RESIZE_BAR_WIDTH,
            );
          }

          if (this._sideElRef) {
            this._persistanceController.saveDataToScope(
              'sideWidth',
              sideWidth,
            );

            const availableSideWidth = this.mainElRef.width - MAIN_RESIZE_ACTION_BAR_WIDTH - SIDE_RESIZE_BAR_WIDTH;

            this._persistanceController.saveDataToScope(
              'contentWidth',
              availableSideWidth - (this.contentConfig.min ?? 0),
            );
          }
        },
      });
  }
}
