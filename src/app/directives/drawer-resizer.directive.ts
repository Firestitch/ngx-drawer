import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2, } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';


@Directive({
  selector: '[fsDrawerResizer]',
})
export class FsDrawerResizerDirective implements OnInit, OnDestroy {

  @Input() public fsDrawerResizer = this._el.nativeElement;
  @Input() public resizeMin = -Infinity;
  @Input() public resizeMax = Infinity;
  @Input() public direction = 'left';
  @Input() public resizable = false;
  @Input() public parentContainer: ElementRef;
  @Input() public actionsContainer: ElementRef;

  private _dragStartHandler = this._dragStart.bind(this);
  private _dragHandler = this._drag.bind(this);
  private _dragEndHandler = this._dragEnd.bind(this);

  private _x = 0;
  private _width = 0;
  private _actionsWidth = 0;

  private readonly _borderPadding = 0;

  private _maxWidthByScreen: number;

  private _destroy$ = new Subject();

  constructor(private _el: ElementRef, private _renderer: Renderer2) {}

  private get minWidth() {
    if (this.resizeMin && this.resizeMin >= 0) {
      if (this.resizeMin > this._maxWidthByScreen) {
        return this._maxWidthByScreen;
      } else {
        return this.resizeMin;
      }
    }
  }

  private get maxWidth() {
    let parentContainerWidth = null;

    if (this.parentContainer) {
      parentContainerWidth = this._getElementWidth(this.parentContainer.nativeElement);
    }

    if (parentContainerWidth !== null) {
      return !this.resizeMax || this.resizeMax >= parentContainerWidth
        ? parentContainerWidth - this._actionsWidth * 2
        : this.resizeMax;
    } else {
      return !this.resizeMax || this.resizeMax >= this._maxWidthByScreen
        ? this._maxWidthByScreen
        : this.resizeMax;
    }
  }

  public ngOnInit() {

    if (this.resizable) {
      this._el.nativeElement.addEventListener('mousedown', this._dragStartHandler, false);
      this._el.nativeElement.addEventListener('touchstart', this._dragStartHandler, false);

      this._renderer.setStyle(this._el.nativeElement, 'cursor', 'col-resize');

      if (this.actionsContainer) {
        this._actionsWidth = this._getElementWidth(this.actionsContainer.nativeElement)
      }

      this._updateMaxScreenWidth();
      this._setMinMaxStyles();

      this._width = this._getElementWidth(this.fsDrawerResizer);

      if (this._width < this.resizeMin) {
        this._width = this.resizeMin;
      }

      this._listenWindowResize();

      this._renderer.setStyle(this.fsDrawerResizer, 'width', `${this._width}px`);
    }
  }

  public ngOnDestroy() {
    this._renderer.removeStyle(this._el.nativeElement, 'cursor');
    this._el.nativeElement.removeEventListener('mousedown', this._dragStartHandler, false);

    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * Subscribe to move events and init base dimensions/restrictions
   * @param event { MouseEvent }
   */
  private _dragStart(event: MouseEvent) {

    this._x = this._getClientX(event);
    this._width = this._getElementWidth(this.fsDrawerResizer);

    this._updateMaxScreenWidth();
    this._setMinMaxStyles();

    if (event.stopPropagation) event.stopPropagation();
    if (event.preventDefault) event.preventDefault();

    event.cancelBubble = true;
    event.returnValue = false;

    document.addEventListener('touchmove', this._dragHandler, false);
    document.addEventListener('touchend', this._dragEndHandler, false);

    document.addEventListener('mousemove', this._dragHandler, false);
    document.addEventListener('mouseup', this._dragEndHandler, false);
  }

  /**
   * Update coordinates during drag
   * @param event
   */
  private _drag(event: MouseEvent) {
    const clientX = this._getClientX(event);

    const predictedWidth = this._calcWidth(this.direction, clientX);

    this._updatePosition(clientX, predictedWidth);
  }

  /**
   * Remove listeners when drag finished
   * @param event
   */
  private _dragEnd(event: MouseEvent) {
    document.removeEventListener('mousemove', this._dragHandler, false);
    document.removeEventListener('mouseup', this._dragEndHandler, false);
    document.removeEventListener('touchmove', this._dragHandler, false);
    document.removeEventListener('touchend', this._dragEndHandler, false);
  }

  /**
   * Listen for browser resize and update restrictions
   */
  private _listenWindowResize() {
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(50),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._updateMaxScreenWidth();
        this._setMinMaxStyles();
      })
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
   * @param el
   */
  private _getElementWidth(el) {
    let width = null;

    try {
      width = window.getComputedStyle(el, null)
        .getPropertyValue('width');
    } catch (error) {
      width = el.currentStyle.width;
    }

    return parseFloat(width);
  }

  /**
   * Update width and position of target element
   * @param clientX
   * @param width
   */
  private _updatePosition(clientX: number, width: number) {
    this._x = clientX;
    this._width = width < 0 ? 0 : width;

    this._renderer.setStyle(this.fsDrawerResizer, 'width', `${this._width}px`)
  }

  /**
   * Calc new width based on offset from previous position
   * @param direction
   * @param clientX
   */
  private _calcWidth(direction, clientX) {
    const directionSign = direction === 'left' ? -1 : 1;

    return this._width + (this._x - clientX) * directionSign;
  }

  /**
   * Set inline styles min/max width
   */
  private _setMinMaxStyles() {
    this._renderer.setStyle(this.fsDrawerResizer, 'min-width', `${this.minWidth}px`);
    this._renderer.setStyle(this.fsDrawerResizer, 'max-width', `${this.maxWidth}px`)
  }

  /**
   * Update current window size
   */
  private _updateMaxScreenWidth() {
    this._maxWidthByScreen = (window.innerWidth - this._borderPadding);
  }
}
