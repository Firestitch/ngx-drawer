import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


export class DrawerData {

  private _data;
  private _dataChange = new Subject<any>();
  private _destroy = new Subject<void>();

  constructor(data: any = {}) {
    this._data = data;
  }

  public static createWithProxy(data: any = {}) {
    const drawerData = new DrawerData(data);

    return new Proxy(drawerData, {
      get(target, property) {
        if (typeof target[property] === 'function'
          || property === '_data'
          || target[property] instanceof Observable
        ) {
          return target[property];
        }

        return target._data[property];

      },

      set(target, property, value) {
        if (property !== '_data') {
          target._data[property] = value;
        } else {
          target[property] = value;
        }

        return true;
      },

      has(target, property) {
        return property in target._data;
      },

      ownKeys(target) {
        return Object.keys(target._data);
      },

      getOwnPropertyDescriptor(target, property) {
        return Object.getOwnPropertyDescriptor(target._data, property);
      },
    });
  }

  public get dataChange$(): Observable<void> {
    return this._dataChange.pipe(takeUntil(this._destroy));
  }

  public getValue() {
    return this._data;
  }

  public setValue(value) {
    this._data = value;
    this._dataChange.next(this._data);
  }

  public destroy() {
    this._destroy.next();
    this._destroy.complete();
  }
}
