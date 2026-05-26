import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import type { DrawerRef } from './drawer-ref';


const PUSH_CLASS = 'fs-drawer-push';
const WIDTH_VAR = '--fs-drawer-push-width';

/**
 * Implements drawer `mode: 'push'`.
 *
 * The drawer is a CDK overlay with no content of its own to push, so this reacts to
 * the drawer mode and publishes a hook the consumer's CSS can use: while in push mode
 * the body carries `fs-drawer-push` and `fs-drawer-push-{position}`, and
 * `--fs-drawer-push-width` tracks the live drawer width. A "pushable" element is then
 * padded by that width (see styles.scss) so it reflows beside the drawer instead of
 * being overlapped — the mat-sidenav `mode="side"` equivalent.
 */
export class DrawerPushController {

  private _enabled = false;
  private _widthSubscription: Subscription | null = null;
  private _destroy$ = new Subject<void>();

  constructor(private _drawerRef: DrawerRef<unknown>) {
    this._drawerRef.mode$
      .pipe(takeUntil(this._destroy$))
      .subscribe((mode) => {
        if (mode === 'push') {
          this._enable();
        } else {
          this._disable();
        }
      });
  }

  public destroy(): void {
    this._disable();
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _enable(): void {
    if (this._enabled) {
      return;
    }

    this._enabled = true;

    document.body.classList.add(PUSH_CLASS);
    document.body.classList.add(`${PUSH_CLASS}-${this._drawerRef.drawerConfig.position}`);

    this._widthSubscription = this._drawerRef.width$
      .pipe(takeUntil(this._destroy$))
      .subscribe((width) => {
        document.body.style.setProperty(WIDTH_VAR, `${width}px`);
      });
  }

  private _disable(): void {
    if (!this._enabled) {
      return;
    }

    this._enabled = false;

    document.body.classList.remove(PUSH_CLASS, `${PUSH_CLASS}-left`, `${PUSH_CLASS}-right`);
    document.body.style.removeProperty(WIDTH_VAR);

    this._widthSubscription?.unsubscribe();
    this._widthSubscription = null;
  }
}
