import { FsPersistance } from '@firestitch/store';

import { IFsDrawerActionConfig } from './action.iterface';


export interface IDrawerConfig<TData = any> {
  data?: TData;
  disableClose?: boolean;
  position?: 'right' | 'left';
  activeAction?: string;
  actions?: IFsDrawerActionConfig<TData>[];
  resizable?: boolean;
  width?: IDrawerWidthConfig,
  persist?: IFsDrawerPersistance;
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

export type IFsDrawerPersistance = FsPersistance;
