import { Actions } from './actions.model';

export class DrawerConfig {
  public disableClose: boolean;
  public position: 'right' | 'left';
  public activeAction: string;
  public width: string;
  public actions: Actions[] | null;

  constructor(data: any = {}) {
    this.disableClose = data.disableClose || false;
    this.position = data.position || 'right';
    this.activeAction = data.activeAction || '';
    this.width = data.width || '500px';
    this.actions = data.actions && data.actions.map((action) => new Actions(action)) || null;
  }
}
