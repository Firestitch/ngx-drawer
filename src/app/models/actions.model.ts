import { Action } from './action.model';

export class Actions extends Action {
  public actions: Action[];

  constructor(data: any = {}) {
    super(data);
    this.actions = data.actions && data.actions.map((action) => new Action(action)) || [];
  }
}
