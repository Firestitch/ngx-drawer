import { AfterViewInit, ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, Input, OnDestroy, OnInit, QueryList, TemplateRef, isDevMode } from '@angular/core';

import { takeUntil } from 'rxjs/operators';

import { DrawerRef } from '../../classes/drawer-ref';
import { FsDrawerActionDirective } from '../../directives/drawer-action.directive';


/**
 * Declares the drawer's side panel. It renders nothing where it sits — it collects the
 * `<ng-template fsDrawerAction>` templates from its content and publishes the active one
 * to the `DrawerRef`, which renders it in the drawer's own `.drawer-side` region.
 *
 * Keeping the side out of the content portal is what lets `.drawer-content` be a plain
 * scroll container instead of a flex row the consumer has to lay out around.
 */
@Component({
    selector: '[fsDrawerSide]',
    template: '',
    styles: [':host { display: none; }'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class FsDrawerSideComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('fsDrawerSide') public drawer: DrawerRef<any>;

  @ContentChildren(FsDrawerActionDirective)
  public actions: QueryList<FsDrawerActionDirective>;

  @ContentChildren(FsDrawerActionDirective, { read: TemplateRef })
  public actionsTemplates: QueryList<TemplateRef<unknown>>;

  private _destroy$ = new EventEmitter();

  public ngOnInit(): void {
    if (!this.drawer) {
      console.error('Drawer reference is null for @Input("fsDrawerSide")');

      return;
    }

    this.drawer.sideToggle$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => this._publishActiveTemplate());
  }

  public ngAfterViewInit(): void {
    // The drawer may already have a side open by now (`config.activeAction`), but this
    // component was only just created by the portal. Defer a tick so the content query is
    // populated, then publish the initial state.
    setTimeout(() => this._publishActiveTemplate());
  }

  public ngOnDestroy(): void {
    this.drawer?.setSideTemplate(null);

    this._destroy$.emit();
    this._destroy$.complete();
  }

  private _publishActiveTemplate(): void {
    this.drawer?.setSideTemplate(this._resolveActiveTemplate());
  }

  private _resolveActiveTemplate(): TemplateRef<unknown> {
    const activeAction = this.drawer.activeAction;

    if (!this.drawer.isSideOpen || !activeAction || !this.actions) {
      return null;
    }

    const index = this.actions
      .toArray()
      .findIndex((action) => action.name === activeAction);

    // A side opened with no matching action template almost always means the
    // host component forgot to import FsDrawerActionDirective — without it
    // `fsDrawerAction` is an inert attribute, so the ContentChildren query
    // finds nothing and the side renders blank. Surface that instead of
    // failing silently.
    if (index === -1) {
      if (isDevMode()) {
        console.warn(
          `[fsDrawerSide] No template found for action "${activeAction}". ` +
          'Ensure the host component imports FsDrawerActionDirective so that ' +
          '<ng-template fsDrawerAction="..."> is recognised.',
        );
      }

      return null;
    }

    return this.actionsTemplates.toArray()[index];
  }
}
