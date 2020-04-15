import { Action } from './action.model';
import { IDrawerConfig } from '@firestitch/drawer';
import { IDrawerWidthConfig } from '../interfaces/drawer-config.interface';


export class DrawerConfig {
  public disableClose: boolean;
  public position: 'right' | 'left';
  public activeAction: string;
  public resizable: boolean;
  public width: IDrawerWidthConfig;
  public actions: Action[] | null;

  constructor(data: IDrawerConfig = {}) {
    this.disableClose = data.disableClose || false;
    this.position = data.position || 'right';
    this.activeAction = data.activeAction || '';

    this.resizable = data.resizable === void 0 ? true : data.resizable;

    if (data.width) {
      this.width = data.width;
    }

    this.actions = data.actions && data.actions.map((action) => new Action(action)) || null;
  }
}
