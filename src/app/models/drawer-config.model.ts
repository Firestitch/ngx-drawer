import { Actions } from './actions.model';
import { Action } from './action.model';

export class DrawerConfig {
  public disableClose: boolean;
  public position: 'right' | 'left';
  public activeAction: string;
  public width: string;
  public resize: { min: number, max: number; minSide: number, maxSide: number };
  public actions: Actions[] | null;

  constructor(data: any = {}) {
    this.disableClose = data.disableClose || false;
    this.position = data.position || 'right';
    this.activeAction = data.activeAction || '';
    this.width = data.width || '500px';
    this.resize = { ...data.resize } || null;
    this.actions = data.actions && data.actions.map((action) => new Action(action)) || null;
  }
}
