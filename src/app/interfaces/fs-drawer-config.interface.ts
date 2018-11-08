import { IActionsConfig } from './actions.interface';

export interface IDrawerConfig {
  data?: any;
  disableClose?: boolean;
  position?: 'right' | 'left';
  activeAction?: string;
  width?: string;
  actions?: IActionsConfig[];
}
