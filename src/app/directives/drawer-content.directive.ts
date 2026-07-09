import { Directive, ElementRef, OnDestroy, OnInit, inject, isDevMode } from '@angular/core';

import { DrawerRef } from '../classes/drawer-ref';


/**
 * Marks the element holding the drawer's content.
 *
 * Without it the content region is only ever defined by what it is not — everything the
 * consumer's component renders that isn't the hidden `[fsDrawerSide]`. That rule is
 * written nowhere in the template. This names the region instead, and publishes its
 * element to the `DrawerRef` so the drawer can reach the content it is showing.
 */
@Directive({
  selector: '[fsDrawerContent]',
  standalone: true,
  host: {
    class: 'drawer-content-body',
  },
})
export class FsDrawerContentDirective implements OnInit, OnDestroy {

  private _el = inject<ElementRef<HTMLElement>>(ElementRef);
  private _drawerRef = inject<DrawerRef<unknown>>(DrawerRef, { optional: true });

  public ngOnInit(): void {
    if (!this._drawerRef) {
      return;
    }

    // A second content region would silently overwrite the first, which is the ambiguity
    // this directive exists to remove. Say so rather than picking a winner quietly.
    if (isDevMode() && this._drawerRef.contentElement) {
      console.warn(
        '[fsDrawerContent] A drawer can mark only one content region, but a second ' +
        'element carries the directive. The last one registered wins.',
      );
    }

    this._drawerRef.setContentElement(this._el);
  }

  public ngOnDestroy(): void {
    // Only stand down if we are still the registered region — a duplicate directive may
    // have taken the slot, and clearing it here would strand the drawer with no content.
    if (this._drawerRef?.contentElement === this._el) {
      this._drawerRef.setContentElement(null);
    }
  }
}
