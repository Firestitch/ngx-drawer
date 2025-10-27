import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  TemplateRef,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { DrawerRef } from '../../classes/drawer-ref';
import { FsDrawerActionDirective } from '../../directives/drawer-action.directive';
import { NgTemplateOutlet } from '@angular/common';
import { FsDrawerResizerDirective } from '../../directives/drawer-resizer.directive';
import { MatIconAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';


@Component({
    selector: '[fsDrawerSide]',
    templateUrl: './drawer-side.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: [
        './drawer-side.component.scss',
    ],
    standalone: true,
    imports: [
        NgTemplateOutlet,
        FsDrawerResizerDirective,
        MatIconAnchor,
        MatIcon,
    ],
})
export class FsDrawerSideComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('fsDrawerSide') public drawer: DrawerRef<any>;

  @HostBinding('class.side') public classSide = true;

  @ContentChildren(FsDrawerActionDirective) actions: QueryList<FsDrawerActionDirective>;

  @ContentChildren(FsDrawerActionDirective, { read: TemplateRef })
  actionsTemplates: QueryList<TemplateRef<any>>;

  public activeTemplate: TemplateRef<any> = null;

  private _hidden = false;
  private _destroy$ = new EventEmitter();

  constructor(
    private _cdRef: ChangeDetectorRef,
    private _renderer: Renderer2,
    private _elRef: ElementRef,
  ) {}

  public set hidden(value: boolean) {
    this._hidden = value;

    if (this._hidden) {
      this._renderer.setAttribute(this._elRef.nativeElement, 'hidden', 'true');
    } else {
      this._renderer.removeAttribute(this._elRef.nativeElement, 'hidden');
    }
  }
  public ngOnInit() {

    this.hidden = true;

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

      this._cdRef.detectChanges();
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

      if (this.drawer.isSideOpen && activatedAction) {
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
