import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


export class DrawerData {

  private _data;
  private _dataUpdated = new Subject<void>();
  private _destroy = new Subject<void>();

  constructor(data: any = {}) {
    this._data = data;
  }

  get dataUpdated$(): Observable<void> {
    return this._dataUpdated.pipe(takeUntil(this._destroy));
  }

  get value() {
    return this._data;
  }

  set value(value) {
    this._data = value;
    this._dataUpdated.next();
  }

  public destroy() {
    this._destroy.next();
    this._destroy.complete();
  }
}
