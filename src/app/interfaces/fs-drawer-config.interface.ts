import { IActionsConfig } from './actions.interface';

export interface IDrawerConfig {
  disableClose?: boolean;
  position?: 'right' | 'left';
  activeAction?: string;
  width?: string;
  actions?: IActionsConfig[];
}
