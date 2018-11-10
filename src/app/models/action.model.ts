export class Action {
  public icon: string;
  public type: string;
  public name: string;
  public tooltip: string;
  public close = false;
  public click: Function | null;
  public actions = [];

  constructor(data: any = {}) {
    this.icon = data.icon || '';
    this.type = data.type || '';
    this.name = data.name || '';
    this.tooltip = data.tooltip || '';
    this.click = data.click || null;
    this.close = !!data.close;
    this.actions = data.actions || [];
  }
}
