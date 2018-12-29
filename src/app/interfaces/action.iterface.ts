import { FsDrawerAction } from '../helpers/action-type.enum';
import { IMenuAction } from './menu-action.interface';


export interface IActionConfig {
  icon?: string;
  tooltip?: string;
  type?: FsDrawerAction;
  name?: string;
  close?: boolean;
  click?: Function;
  actions?: IMenuAction[];
  component?: any;
  data?: any;
}
