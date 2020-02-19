import { IDrawerActionShowFn } from './action.iterface';


export interface IMenuAction<TData = any> {
  label?: string;
  icon?: string;
  click?: (data: { data: TData, event: MouseEvent }) => void;
  show?: IDrawerActionShowFn<TData>;
}
