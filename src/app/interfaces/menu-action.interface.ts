import { IDrawerActionShowFn } from './action.iterface';


export interface IMenuAction {
  label?: string;
  icon?: string;
  click?: (data: any, event: any) => void;
  show?: IDrawerActionShowFn;
}
