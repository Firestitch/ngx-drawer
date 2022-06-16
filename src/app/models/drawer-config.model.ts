import { BehaviorSubject, Observable } from 'rxjs';

import { Action } from './action.model';
import {
  IDrawerConfig,
  IDrawerWidthConfig,
  IFsDrawerPersistance,
} from '../interfaces/drawer-config.interface';
import { IFsDrawerActionConfig } from '../interfaces/action.iterface';


export class DrawerConfig {
  public disableClose: boolean;
  public position: 'right' | 'left';
  public activeAction: string;
  public resizable: boolean;
  public width: IDrawerWidthConfig;
  public persist: IFsDrawerPersistance;
  public actions$: Observable<Action[]>;

  private _actions$ = new BehaviorSubject<Action[]>([]);

  constructor(data: IDrawerConfig = {}) {
    this.disableClose = data.disableClose || false;
    this.position = data.position || 'right';
    this.activeAction = data.activeAction || '';
    this.persist = data.persist;

    this.resizable = data.resizable === void 0 ? true : data.resizable;

    if (data.width) {
      this.width = data.width;
    }

    this.actions$ = this._actions$.asObservable();

    this.setActions(data.actions);
  }

  public get actions(): Action[] {
    return this._actions$.value;
  }

  public setActions(actions: IFsDrawerActionConfig<unknown>[]): void {
    const newActions = (actions || [])
      .map((action) => new Action(action));

    this._actions$.next(newActions);
  }

}
