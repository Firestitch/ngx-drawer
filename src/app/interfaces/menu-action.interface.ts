import { IDrawerActionLinkFn, IDrawerActionShowFn, IMenuActionClick } from './action.iterface';


export interface IMenuAction<TData = any> {
  label: string;
  icon?: string;
  click?: <T, R>(data: IMenuActionClick<TData, T, R>) => void
  link?: IDrawerActionLinkFn<TData>;
  show?: IDrawerActionShowFn<TData>;
}
