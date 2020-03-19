import { BaseAction } from './base-action';
import { DrawerData } from '../classes/drawer-data';


export class MenuAction extends BaseAction {
  public actions: MenuAction[] = [];

  private _label: string;

  private readonly _isGroup: boolean = false;

  constructor(data: any = {}) {
    super(data);

    if (Array.isArray(data.actions)) {
      this._isGroup = true;

      this.actions = data.actions.map((action) => new MenuAction(action));
    }
    this._label = data.label || '';
  }

  get isGroup() {
    return this._isGroup;
  }

  get label() {
    return this._label;
  }

  public updateRouterLink(data) {
    super.updateRouterLink(data);

    if (this.actions.length > 0) {
      this.actions.forEach((action) => {
        action.updateRouterLink(data);
      })
    }
  }


  public checkVisibility(data: DrawerData) {
    super.checkVisibility(data);

    if (this.actions.length > 0) {
      this.actions.forEach((action) => {
        action.checkVisibility(data);
      })
    }

    if (this.actions.length > 0) {
      this._visible = this.actions.some((action) => action.visible);
    }
  }
}
