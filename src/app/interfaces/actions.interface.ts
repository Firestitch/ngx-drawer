import { IActionConfig } from './action.iterface';

export interface IActionsConfig extends IActionConfig {
  actions?: IActionConfig[];
}
