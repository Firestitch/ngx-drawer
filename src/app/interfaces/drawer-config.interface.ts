import { UrlTree } from '@angular/router';

import { FsPersistance } from '@firestitch/store';

import { IFsDrawerActionConfig } from './action.iterface';


export type FsDrawerMode = 'over' | 'push';

export interface IDrawerConfig<TData = any> {
  data?: TData;
  disableClose?: boolean;
  position?: 'right' | 'left';
  activeAction?: string;
  actions?: IFsDrawerActionConfig<TData>[];
  resizable?: boolean;
  url?: UrlTree;
  width?: IDrawerWidthConfig;
  persist?: IFsDrawerPersistance;

  /**
   * How the drawer relates to the content behind it.
   *
   * - `over` (default): the drawer floats over the page as an overlay.
   * - `push`: the body gets the `fs-drawer-push`/`fs-drawer-push-{position}` classes
   *   and `--fs-drawer-push-width` tracks the live drawer width, so a "pushable"
   *   element can reflow beside the drawer instead of being overlapped (mat-sidenav
   *   `mode="side"` equivalent). The consumer decides what gets pushed via CSS.
   */
  mode?: FsDrawerMode;
}

export interface IDrawerWidthConfig {
  main?: IDrawerWidthDefinition;
  side?: IDrawerWidthDefinition;
  content?: Omit<IDrawerWidthDefinition, 'initial' | 'max'>;
}

export interface IDrawerWidthDefinition {
  initial?: number;
  min?: number;
  max?: number;
}

export type IFsDrawerPersistance = FsPersistance;
