import { IMenuAction } from './menu-action.interface';
import { FsDrawerAction } from '../helpers/action-type.enum';
import { DrawerMenuRef } from '../classes/drawer-menu-ref';


export interface IActionConfig {
  icon: string;
  tooltip?: string;
  type?: FsDrawerAction;
  name?: string;
  close?: boolean;
  closeSide?: boolean;
  click?: <T, R>(event, menuRef?: DrawerMenuRef<T, R>) => void;
  actions?: IMenuAction[];
  component?: any;
  data?: any;
}
