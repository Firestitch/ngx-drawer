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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsDrawerSideComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('fsDrawerSide') public drawer: DrawerRef<any>;

  @HostBinding('hidden') public hidden = false;
  @HostBinding('class.side') public classSide = true;

  @ContentChildren(FsDrawerActionDirective) actions: QueryList<FsDrawerActionDirective>;

  @ContentChildren(FsDrawerActionDirective, { read: TemplateRef })
  actionsTemplates: QueryList<TemplateRef<any>>;

  public activeTemplate: TemplateRef<any> = null;

  private _destroy$ = new EventEmitter();

  constructor(
    private _cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit() {

    if (!this.drawer) {
      console.error('Drawer reference is null for @Input("fsDrawerSide")');
    }

    this._subscribeToActionChanges();
  }

  public ngAfterViewInit() {
    setTimeout(() => {
      // Check current side status
      if (this.drawer) {
        this.hidden = !this.drawer.isSideOpen;
      }

      this._updateActiveActionTemplate();
    });
  }

  public ngOnDestroy() {
    this._destroy$.emit();
    this._destroy$.complete();
  }

  private _subscribeToActionChanges() {
    if (this.drawer) {
      this.drawer.sideToggle$
        .pipe(
          takeUntil(this._destroy$),
        )
        .subscribe(() => {
          this.hidden = !this.drawer.isSideOpen;
          this._updateActiveActionTemplate();

          this._cdRef.detectChanges();
        });
    }
  }

  private _updateActiveActionTemplate() {
    if (this.drawer) {
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
}
