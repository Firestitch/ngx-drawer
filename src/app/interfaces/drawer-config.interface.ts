import { IActionConfig } from './action.iterface';

export interface IDrawerConfig {
  data?: any;
  disableClose?: boolean;
  position?: 'right' | 'left';
  activeAction?: string;
  width?: string;
  actions?: IActionConfig[];
  resize?: { min?: number, max?: number; minSide?: number, maxSide?: number }
}
