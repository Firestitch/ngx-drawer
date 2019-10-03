import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { DrawerRef } from '../../classes/drawer-ref';
import { FsDrawerActionDirective } from '../../directives/drawer-action.directive';


@Component({
  selector: '[fsDrawerSide]',
  templateUrl: './drawer-side.component.html',
  host: {
    'class': 'side',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsDrawerSideComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('fsDrawerSide') public drawer: DrawerRef<any>;

  @HostBinding('hidden') public hidden = false;

  @ContentChildren(FsDrawerActionDirective) actions: QueryList<FsDrawerActionDirective>;

  @ContentChildren(FsDrawerActionDirective, { read: TemplateRef })
  actionsTemplates: QueryList<TemplateRef<any>>;

  public activeTemplate: TemplateRef<any> = null;

  private _destroy$ = new EventEmitter();

  constructor(
    private _cdRef: ChangeDetectorRef,
  ) {
  }

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

        this._cdRef.detectChanges();
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
