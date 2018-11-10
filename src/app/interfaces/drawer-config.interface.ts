import { IActionConfig } from './action.iterface';

export interface IDrawerConfig {
  data?: any;
  disableClose?: boolean;
  position?: 'right' | 'left';
  activeAction?: string;
  width?: string;
  actions?: IActionConfig[];
}