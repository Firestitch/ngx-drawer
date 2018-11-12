import {
  EventEmitter,
  QueryList,
  TemplateRef,
  Component,
  ContentChildren,
  HostBinding,
  Input,
  OnInit,
  OnDestroy, AfterViewInit,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { DrawerRef } from '../../classes';
import { FsDrawerActionDirective } from '../../directives';


@Component({
  selector: '[fsDrawerSide]',
  templateUrl: './drawer-side.component.html',
  host: {
    'class': 'side',
  }
})
export class FsDrawerSideComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('fsDrawerSide') public drawer: DrawerRef<any>;

  @HostBinding('hidden') public hidden = false;

  @ContentChildren(FsDrawerActionDirective) actions: QueryList<FsDrawerActionDirective>;

  @ContentChildren(FsDrawerActionDirective, { read: TemplateRef })
  actionsTemplates: QueryList<TemplateRef<any>>;

  public activeTemplate: TemplateRef<any> = null;

  private _destroy$ = new EventEmitter();

  public ngOnInit() {
    this.subscribeToActionChanges();
  }

  public ngAfterViewInit() {
    setTimeout(() => {
      // Check current side status
      this.hidden = !this.drawer.isSideOpen;

      this.updateActiveActionTemplate();
    });
  }

  public ngOnDestroy() {
    this._destroy$.emit();
    this._destroy$.complete();
  }

  private subscribeToActionChanges() {
    this.drawer.activeActionChange()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.hidden = !this.drawer.isSideOpen;
        this.updateActiveActionTemplate();
      })
  }

  private updateActiveActionTemplate() {
    const activatedAction = this.drawer.activeAction;

    if (activatedAction) {
      const selectedActionIndex = this.actions
        .toArray()
        .findIndex((action) => action.name === activatedAction);

      this.activeTemplate = this.actionsTemplates.toArray()[selectedActionIndex];
    } else {
      this.activeTemplate = null;
    }
  }
}
