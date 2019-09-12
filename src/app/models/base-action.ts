import { IDrawerActionShowFn } from '../interfaces/action.iterface';
import { DrawerData } from '../classes/drawer-data';

export class BaseAction {

  protected _visible = true;

  protected _icon: string;
  protected readonly _show: IDrawerActionShowFn;
  protected readonly _click: Function | null;

  constructor(data: any = {}) {
    this._icon = data.icon || '';
    this._click = data.click || null;
    this._show = data.show || null;
  }

  get icon() {
    return this._icon;
  }

  get click() {
    return this._click;
  }

  get visible() {
    return this._visible
  }

  public checkVisibility(data: DrawerData) {
    if (this._show) {
      this._visible = this._show(data);
    }
  }
}
