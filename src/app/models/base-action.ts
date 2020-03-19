import {
  IDrawerActionLink,
  IDrawerActionLinkFn,
  IDrawerActionShowFn,
  IMenuActionClick
} from '../interfaces/action.iterface';
import { DrawerData } from '../classes/drawer-data';

export class BaseAction {

  protected _visible = true;
  protected _routerLink: IDrawerActionLink;

  protected _icon: string;
  protected readonly _show: IDrawerActionShowFn;
  protected readonly _click: Function | null;
  protected readonly _link: IDrawerActionLinkFn;

  constructor(data: any = {}) {
    this._icon = data.icon || '';
    this._click = data.click || null;
    this._link = data.link;
    this._show = data.show || null;
  }

  get icon() {
    return this._icon;
  }

  get click() {
    return this._click;
  }

  get routerLink() {
    return this._routerLink;
  }

  get visible() {
    return this._visible
  }

  public checkVisibility(data: DrawerData) {
    if (this._show) {
      this._visible = this._show(data);
    }
  }

  public updateRouterLink(data: IMenuActionClick) {
    if (this._visible && this._link) {
      this._routerLink = this._link(data);
    }
  }
}
