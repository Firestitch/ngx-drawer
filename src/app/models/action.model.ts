import { FsDrawerAction } from '../helpers/action-type.enum';


export class Action {
  public icon: string;
  public type: FsDrawerAction;
  public name: string;
  public tooltip: string;
  public close = false;
  public closeSide = true;
  public click: Function | null;
  public actions = [];
  public component = null;
  public data: any = null;
  public menuRefName = null;

  constructor(data: any = {}) {
    this.icon = data.icon || '';
    this.type = data.type || '';
    this.name = data.name || '';
    this.tooltip = data.tooltip || '';
    this.click = data.click || null;
    this.close = !!data.close;
    this.closeSide = data.closeSide === void 0 ? true : !!data.closeSide;
    this.actions = data.actions || [];
    this.component = data.component || null;
    this.data = data.data || {};

    if (this.type === FsDrawerAction.component) {
      this.menuRefName = data.name || data.icon;
    }
  }
}
