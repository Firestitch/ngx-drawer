import { IMenuAction } from './menu-action.interface';
import { FsDrawerAction } from '../helpers/action-type.enum';
import { DrawerMenuRef } from '../classes/drawer-menu-ref';
import { Action } from '../models/action.model';


export interface IActionConfig {
  icon: string;
  tooltip?: string;
  toggle?: boolean;
  type?: FsDrawerAction;
  name?: string;
  close?: boolean;
  closeSide?: boolean;
  click?: <T, R>(data: IActionClickEvent, menuRef?: DrawerMenuRef<T, R>) => void;
  actions?: IMenuAction[];
  component?: any;
  data?: any;
}

export interface IActionClickEvent {
  event: MouseEvent,
  action: Action,
}
