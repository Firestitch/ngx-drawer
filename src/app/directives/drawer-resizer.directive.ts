import {
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DrawerRef } from '../classes/drawer-ref';
import { DrawerSizeController } from '../classes/drawer-size-controller';
import { MAIN_RESIZE_ACTION_BAR_WIDTH, SIDE_RESIZE_BAR_WIDTH } from '../consts/sizes.cont';


@Directive({
    selector: '[fsDrawerResizer]',
    host: {
        '[style.cursor]': '"col-resize"',
    },
    standalone: true,
})
export class FsDrawerResizerDirective implements OnInit, OnDestroy {

  @Input() public fsDrawerResizer;
  @Input() public type: 'main' | 'side';
  @Input() public direction = 'left';
  @Input() public resizable = true;
  @Input() public parentContainer: ElementRef;
  @Input() public actionsContainer: ElementRef;
  @Input() public sizeController: DrawerSizeController;

  private _dragStartHandler = this._dragStart.bind(this);
  private _dragHandler = this._drag.bind(this);
  private _dragEndHandler = this._dragEnd.bind(this);

  private _x = 0;
  private _width$ = new BehaviorSubject<number>(0);
  private _actionsWidth = 0;

  private _destroy$ = new Subject();

  constructor(
    private _el: ElementRef,
    private _renderer: Renderer2,
    private _ngZone: NgZone,
    private _drawerRef: DrawerRef<any>,
  ) {
    this.fsDrawerResizer = this._el.nativeElement;
  }

  public get drawerRef(): DrawerRef<any> {
    return this._drawerRef;
  }

  public get isMainDrawer(): boolean {
    return this.type === 'main';
  }

  public get isSideDrawer(): boolean {
    return this.type === 'side';
  }

  public get width(): number {
    return this._width$.getValue();
  }

  public get width$(): Observable<number> {
    return this._width$.pipe(takeUntil(this._destroy$));
  }

  private get minWidth(): number {
    const minWidth = this.sizeController.getMinWidth(this.type);

    if (minWidth && minWidth >= 0) {
      const screenWidth = this.sizeController.screenWidth;
      const barWidth = this.barWidth;

      if (screenWidth - minWidth < barWidth) {
        return this.sizeController.screenWidth - barWidth;
      }

      return minWidth;

    }
  }

  private get maxWidth(): number {
    const maxWidth = this.sizeController.getMaxWidth(this.type);
    let parentContainerWidth = null;

    if (this.parentContainer) {
      parentContainerWidth = this._getElementWidth(this.parentContainer.nativeElement);
    }

    if (parentContainerWidth !== null) {
      return !maxWidth || maxWidth >= parentContainerWidth
        ? parentContainerWidth - this._actionsWidth * 2
        : maxWidth;
    }

    return !maxWidth || maxWidth >= this.sizeController.screenWidth
      ? this.sizeController.screenWidth
      : maxWidth;

  }

  public get barWidth(): number {
    return this.isMainDrawer
      ? MAIN_RESIZE_ACTION_BAR_WIDTH
      : SIDE_RESIZE_BAR_WIDTH;
  }

  public ngOnInit() {

    this.sizeController.registerElRef(this);

    if (this.resizable) {
      this._ngZone.runOutsideAngular(() => {
        this._el.nativeElement.addEventListener('mousedown', this._dragStartHandler, false);
        this._el.nativeElement.addEventListener('touchstart', this._dragStartHandler, false);
      });

      if (this.actionsContainer) {
        this._actionsWidth = this._getElementWidth(this.actionsContainer.nativeElement);
      }

      this.setMinMaxStyles();

      const minWidth = this.sizeController.getMinWidth(this.type);
      let width = this.sizeController.getInitialWidth(this.type)
        || this._getElementWidth(this.fsDrawerResizer);

      if (width < minWidth) {
        width = minWidth;
      }

      this.updateWidth(width);
    }
  }

  public updateWidth(width) {
    const minConfiguredWidth = this.sizeController.getMinWidth(this.type);
    const maxConfiguredWidth = this.sizeController.getMaxWidth(this.type);
    const availableWidth = this.sizeController.screenWidth;

    // newWidth should not be
    // greater than maxConfiguredWidth
    // and not lesser than minConfiguredWidth
    width = Math.max(minConfiguredWidth, Math.min(width, maxConfiguredWidth));
    // and sure it shouldn't be greater than screen width
    width = Math.min(width, availableWidth);

    if (width === this.width) {
      return;
    }

    this._width$.next(width);

    requestAnimationFrame(() => {
      this._renderer.setStyle(this.fsDrawerResizer, 'width', `${width}px`);
    });
  }

  public ngOnDestroy() {
    this._el.nativeElement.removeEventListener('mousedown', this._dragStartHandler, false);
    this._el.nativeElement.removeEventListener('touchstart', this._dragStartHandler, false);

    this.sizeController.removeElRef(this);

    this._destroy$.next(null);
    this._destroy$.complete();
  }

  /**
   * Set inline styles min/max width
   */
  public setMinMaxStyles() {
    requestAnimationFrame(() => {
      this._renderer.setStyle(this.fsDrawerResizer, 'min-width', `${this.minWidth}px`);
      this._renderer.setStyle(this.fsDrawerResizer, 'max-width', `${this.maxWidth}px`);
    });
  }

  /**
   * Subscribe to move events and init base dimensions/restrictions
   *
   * @param event { MouseEvent }
   */
  private _dragStart(event: MouseEvent) {

    this._x = this._getClientX(event);
    this.updateWidth(this._getElementWidth(this.fsDrawerResizer));

    this.setMinMaxStyles();

    document.addEventListener('touchmove', this._dragHandler, false);
    document.addEventListener('touchend', this._dragEndHandler, false);

    document.addEventListener('mousemove', this._dragHandler, false);
    document.addEventListener('mouseup', this._dragEndHandler, false);
  }

  /**
   * Update coordinates during drag
   *
   * @param event
   */
  private _drag(event: MouseEvent) {
    const clientX = this._getClientX(event);

    const predictedWidth = this._calcWidth(this.direction, clientX);

    this._updatePosition(clientX, predictedWidth);
    this._emitResizeEvent();
  }

  /**
   * Remove listeners when drag finished
   *
   * @param event
   */
  private _dragEnd(event: MouseEvent) {
    document.removeEventListener('mousemove', this._dragHandler, false);
    document.removeEventListener('mouseup', this._dragEndHandler, false);
    document.removeEventListener('touchmove', this._dragHandler, false);
    document.removeEventListener('touchend', this._dragEndHandler, false);
  }

  /**
   *
   * @param event
   */
  private _getClientX(event) {
    return event.touches ? event.touches[0].clientX : event.clientX;
  }

  /**
   * Will return width of element
   *
   * @param el
   */
  private _getElementWidth(el) {
    return el.getBoundingClientRect().width;
  }

  /**
   * Update width and position of target element
   *
   * @param clientX
   * @param width
   */
  private _updatePosition(clientX: number, width: number) {
    this._x = clientX;
    this.updateWidth(width < 0 ? 0 : width);
  }

  /**
   * Calc new width based on offset from previous position
   *
   * @param direction
   * @param clientX
   */
  private _calcWidth(direction, clientX) {
    const directionSign = direction === 'left' ? -1 : 1;

    return this.width + (this._x - clientX) * directionSign;
  }

  /**
   * Resize event for Window
   *
   * important for Froala editor actions
   */
  private _emitResizeEvent() {
    const resizeEvent = window.document.createEvent('UIEvents');
    resizeEvent.initEvent('resize', true, false);

    window.dispatchEvent(resizeEvent);
  }
}
