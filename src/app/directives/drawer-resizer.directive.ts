import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2, } from '@angular/core';

@Directive({
  selector: '[fsDrawerResizer]',
})
export class FsDrawerResizerDirective implements OnInit, OnDestroy {

  @Input() public fsDrawerResizer = this._el.nativeElement;
  @Input() public resizeMin = -Infinity;
  @Input() public resizeMax = Infinity;
  @Input() public direction = 'left';
  @Input() public resizable = false;

  private _dragStartHandler = this._dragStart.bind(this);
  private _dragHandler = this._drag.bind(this);
  private _dragEndHandler = this._dragEnd.bind(this);

  private _x = 0;
  private _width = 0;

  constructor(private _el: ElementRef, private _renderer: Renderer2) {}

  public ngOnInit() {
    if (this.resizable) {
      this._el.nativeElement.addEventListener('mousedown', this._dragStartHandler, false);
      this._renderer.setStyle(this._el.nativeElement, 'cursor', 'col-resize');
    }
  }

  public ngOnDestroy() {
    this._renderer.removeStyle(this._el.nativeElement, 'cursor');
    this._el.nativeElement.removeEventListener('mousedown', this._dragStartHandler, false);
  }

  private _dragStart(e) {

    const sizes = this.fsDrawerResizer.getBoundingClientRect();
    this._x = this._getClientX(e);
    this._width = sizes.width;

    document.addEventListener('mouseup', this._dragEndHandler, false);
    document.addEventListener('mousemove', this._dragHandler, false);
  }

  private _drag(e) {
    const clientX = this._getClientX(e);
    let predictedWidth = null;

    switch (this.direction) {
      case 'left': {
        predictedWidth = this._width - (this._x - clientX);
      } break;

      case 'right': {
        predictedWidth = this._width + (this._x - clientX);
      } break;
    }

    if (predictedWidth > +this.resizeMin && predictedWidth < +this.resizeMax) {
      this._width = predictedWidth;
      this._x = clientX;
      this._renderer.setStyle(this.fsDrawerResizer, 'width', `${this._width}px`)
    }
  }

  private _dragEnd(e) {
    document.removeEventListener('mouseup', this._dragEndHandler, false);
    document.removeEventListener('mousemove', this._dragHandler, false);
  }

  private _getClientX = function(e) {
    return e.touches ? e.touches[0].clientX : e.clientX;
  }
}
