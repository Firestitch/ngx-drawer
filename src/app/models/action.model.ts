import { FsDrawerAction } from '../helpers/action-type.enum';


export class Action {
  private _icon: string;
  private _tooltip: string;
  private _data: any = null;
  private readonly _toggle: boolean;
  private readonly _type: FsDrawerAction;
  private readonly _name: string;
  private readonly _close: boolean = false;
  private readonly _closeSide: boolean = true;
  private readonly _click: Function | null;
  private readonly _actions = [];
  private readonly _component = null;
  private readonly _menuRefName = null;

  constructor(data: any = {}) {
    this._icon = data.icon || '';
    this._type = data.type || '';
    this._name = data.name || '';
    this._toggle = data.toggle === void 0 ? true : data.toggle;
    this._tooltip = data.tooltip || '';
    this._click = data.click || null;
    this._close = !!data.close;
    this._closeSide = data.closeSide === void 0 ? true : !!data.closeSide;
    this._actions = data.actions || [];
    this._component = data.component || null;
    this._data = data.data === void 0 ? {} : data.data;

    if (this._type === FsDrawerAction.Component) {
      this._menuRefName = data.name || data.icon;
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

  get click() {
    return this._click;
  }

  get actions() {
    return this._actions;
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
}
