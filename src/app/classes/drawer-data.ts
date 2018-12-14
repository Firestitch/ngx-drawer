import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


export class DrawerData {

  private _data;
  private _dataChange = new Subject<void>();
  private _destroy = new Subject<void>();

  constructor(data: any = {}) {
    this._data = data;
  }

  get dataChange$(): Observable<void> {
    return this._dataChange.pipe(takeUntil(this._destroy));
  }

  get value() {
    return this._data;
  }

  set value(value) {
    this._data = value;
    this._dataChange.next();
  }

  public destroy() {
    this._destroy.next();
    this._destroy.complete();
  }
}
