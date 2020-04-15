import { IFsDrawerActionConfig } from './action.iterface';
import { DrawerData } from '../classes/drawer-data';

export interface IDrawerConfig<TData = any> {
  data?: TData;
  disableClose?: boolean;
  position?: 'right' | 'left';
  activeAction?: string;
  actions?: IFsDrawerActionConfig<TData>[];
  resizable?: boolean;
  width?: IDrawerWidthConfig,
}

export interface IDrawerWidthConfig {
  main?: IDrawerWidthDefinition;
  side?: IDrawerWidthDefinition;
}

export interface IDrawerWidthDefinition {
  initial?: number;
  min?: number;
  max?: number;
}
