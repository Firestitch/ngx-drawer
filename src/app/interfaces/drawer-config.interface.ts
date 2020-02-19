import { IActionConfig } from './action.iterface';
import { DrawerData } from '../classes/drawer-data';

export interface IDrawerConfig<TData = any> {
  data?: TData;
  disableClose?: boolean;
  position?: 'right' | 'left';
  activeAction?: string;
  width?: string;
  actions?: IActionConfig<TData>[];
  resize?: { min?: number, max?: number; minSide?: number, maxSide?: number }
}
