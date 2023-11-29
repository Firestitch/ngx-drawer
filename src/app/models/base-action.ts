import { DrawerData } from '../classes/drawer-data';
import {
  IDrawerActionLink,
  IDrawerActionLinkFn,
  IDrawerActionShowFn,
  IMenuActionClick,
} from '../interfaces/action.iterface';

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

  public get icon() {
    return this._icon;
  }

  public get click() {
    return this._click;
  }

  public get routerLink() {
    return this._routerLink;
  }

  public get visible() {
    return this._visible;
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
