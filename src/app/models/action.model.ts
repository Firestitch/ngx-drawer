import { FsDrawerAction } from '../helpers/action-type.enum';
import { BaseAction } from './base-action';
import { DrawerData } from '../classes/drawer-data';
import { MenuAction } from './menu-action.model';


export class Action extends BaseAction {
  private _tooltip: string;
  private _data: any = null;
  private _disabled = false;

  private readonly _toggle: boolean;
  private readonly _type: FsDrawerAction;
  private readonly _name: string;
  private readonly _close: boolean = false;
  private readonly _closeSide: boolean = true;
  private readonly _menuActions: MenuAction[] = [];
  private readonly _component = null;
  private readonly _menuRefName = null;

  constructor(data: any = {}) {
    super(data);
    this._icon = data.icon || '';
    this._type = data.type || '';
    this._name = data.name || '';
    this._toggle = data.toggle === void 0 ? true : data.toggle;
    this._tooltip = data.tooltip || '';
    this._close = !!data.close;
    this._component = data.component || null;
    this._data = data.data === void 0 ? {} : data.data;
    this._disabled = data.disabled ?? false;

    if (this._type === FsDrawerAction.Component) {
      this._menuRefName = data.name || data.icon;
    }

    if (this._type === FsDrawerAction.Menu && data.closeSide === void 0) {
     this._closeSide = false;
    } else {
      this._closeSide = data.closeSide === void 0 ? true : !!data.closeSide;
    }

    if (Array.isArray(data.actions)) {
      this._menuActions = data.actions.map((action) => new MenuAction(action));
    }
  }

  get icon() {
    return this._icon;
  }

  set icon(value: string) {
    this._icon = value;
  }

  get type() {
    return this._type;
  }

  get toggle() {
    return this._toggle;
  }

  get name() {
    return this._name;
  }

  get tooltip() {
    return this._tooltip;
  }

  set tooltip(value: string) {
    this._tooltip = value;
  }

  get close() {
    return this._close;
  }

  get closeSide() {
    return this._closeSide;
  }

  get menuActions() {
    return this._menuActions;
  }

  get component() {
    return this._component;
  }

  get data() {
    return this._data;
  }

  set data(value: any) {
    this._data = value;
  }

  get menuRefName() {
    return this._menuRefName;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = value;
  }

  public updateRouterLink(data) {
    if (this._visible) {
      super.updateRouterLink(data);

      if (this._menuActions.length > 0) {
        this._menuActions.forEach((action) => {
          action.updateRouterLink(data);
        })
      }
    }
  }

  public checkVisibility(data: DrawerData) {
    super.checkVisibility(data);

    if (this._menuActions.length > 0) {
      this._menuActions.forEach((action) => {
        action.checkVisibility(data);
      })
    }

    if (this.menuActions.length > 0) {
      this._visible = this.menuActions.some((action) => action.visible);
    }
  }
}
