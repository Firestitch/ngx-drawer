import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FsDrawerAction } from '../../helpers/action-type.enum';


@Component({
  selector: 'fs-drawer-actions',
  templateUrl: './drawer-actions.component.html',
  styleUrls: [ './drawer-actions.component.scss' ],
})
export class FsDrawerActionsComponent {
  @Input() public actions;
  @Input() public activeAction: string;

  @Output() public actionClicked = new EventEmitter();
  @Output() public menuActionClicked = new EventEmitter();

  public actionTypes = FsDrawerAction;

  public actionClick(action, event) {
    this.actionClicked.next({ action, event });
  }

  public menuActionClick(action, event) {
    this.menuActionClicked.next({ action, event });
  }
}
