import { AsyncPipe, Location, NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentRef, ElementRef, EmbeddedViewRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, inject } from '@angular/core';

import {
  BasePortalOutlet,
  CdkPortalOutlet,
  ComponentPortal,
  TemplatePortal,
} from '@angular/cdk/portal';
import { MatIconAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { getNormalizedPath } from '@firestitch/common';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DrawerPushController } from '../../classes/drawer-push-controller';
import { DrawerRef } from '../../classes/drawer-ref';
import { DrawerSizeController } from '../../classes/drawer-size-controller';
import { FsDrawerPersistanceController } from '../../classes/persistance-controller';
import { FsDrawerResizerDirective } from '../../directives/drawer-resizer.directive';
import { DrawerConfig } from '../../models/drawer-config.model';
import { FsDrawerMenuService } from '../../services/drawer-menu.service';
import { FsDrawerActionBarComponent } from '../drawer-action-bar/drawer-action-bar.component';


@Component({
  selector: 'fs-drawer',
  templateUrl: './drawer.component.html',
  providers: [
    FsDrawerMenuService,
    FsDrawerPersistanceController,
    DrawerSizeController,
  ],
  host: {
    class: 'fs-drawer-container',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgClass,
    NgTemplateOutlet,
    FsDrawerActionBarComponent,
    FsDrawerResizerDirective,
    CdkPortalOutlet,
    MatIconAnchor,
    MatIcon,
    AsyncPipe,
  ],
})
export class FsDrawerComponent extends BasePortalOutlet implements OnInit, OnDestroy {

  public config: DrawerConfig;
  public isOpen = false;
  public isOpenSide = false;

  /** Active side-panel template, published by `fsDrawerSide` via the DrawerRef. */
  public sideTemplate: TemplateRef<unknown> = null;

  @ViewChild(CdkPortalOutlet, { static: true })
  private _portalOutlet: CdkPortalOutlet;

  @ViewChild('drawerContainer', { static: true })
  private _drawerContainer: ElementRef;

  @ViewChild('drawerContent', { static: true })
  private _drawerContent: ElementRef;

  private _sideOpen = false;
  private _pushController: DrawerPushController;
  private _destroy$ = new Subject();
  private _el = inject<ElementRef<HTMLElement>>(ElementRef);
  private _drawerRef = inject<DrawerRef<any>>(DrawerRef);
  private _cdRef = inject(ChangeDetectorRef);
  private _resizeController = inject(DrawerSizeController);
  private _persistanceController = inject(FsDrawerPersistanceController);
  private _location = inject(Location);


  constructor() {
    super();
    this._drawerRef.resizeController = this._resizeController;
  }

  public get drawerRef(): DrawerRef<unknown> {
    return this._drawerRef;
  }

  /**
   * Which way the side resizer grows the side panel. The regions run
   * `bar | side | resizer | content`, and a left-positioned drawer reverses that row, so
   * the drag has to reverse with it.
   */
  public get sideResizeDirection(): 'left' | 'right' {
    return this.config?.position === 'right' ? 'left' : 'right';
  }

  public get sideOpen(): boolean {
    return this._sideOpen;
  }

  public set sideOpen(value: boolean) {
    this._sideOpen = value;

    this._el.nativeElement.classList
      .toggle('side-open', this.sideOpen);
  }

  public ngOnInit() {
    this._listenDataChanges();
    this._listenSideToggle();
    this._listenSideTemplate();

    // Need to be like a parent for children resize
    this._drawerRef.drawerContainer = this._drawerContainer;
    this._drawerRef.drawerContent = this._drawerContent;

    this.config = this._drawerRef.drawerConfig;
    if (this.config.persist) {
      const namespace = getNormalizedPath(this._location);
      this._persistanceController.setConfig(this.config.persist, namespace);
    }

    this._resizeController.init();

    // Owns `mode: 'push'` — toggles the push body class + width variable in step
    // with the drawer's mode and live width.
    this._pushController = new DrawerPushController(this._drawerRef);
  }

  public ngOnDestroy(): void {
    this._pushController?.destroy();

    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public open() {
    this.isOpen = true;
  }

  public close() {
    this.isOpen = false;
  }

  public openSide() {
    this.isOpenSide = true;
  }

  public closeSide() {
    this.isOpenSide = false;
  }

  /**
   * Attach a ComponentPortal as content to this drawer container.
   *
   * @param portal Portal to be attached as the drawer content.
   */
  public attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    if (this._portalOutlet.hasAttached()) {
      throw Error('Drawer component already attached');
    }

    const componentRef = this._portalOutlet.attachComponentPortal(portal);

    // Angular builds this host element from the consumer's component selector, so it is an
    // unknown element with no UA display — an inline box unless something says otherwise.
    // The stylesheet gives it a block default at zero specificity, so the consumer's own
    // `:host` rule still wins.
    componentRef.location.nativeElement.classList.add('drawer-content-host');

    return componentRef;
  }

  /**
   * Attach a TemplatePortal as content to this drawer container.
   *
   * @param portal Portal to be attached as the drawer content.
   */
  public attachTemplatePortal<TC>(portal: TemplatePortal<TC>): EmbeddedViewRef<TC> {
    if (this._portalOutlet.hasAttached()) {
      throw Error('Drawer template already attached');
    }

    return this._portalOutlet.attachTemplatePortal(portal);
  }

  private _listenDataChanges(): void {
    this._drawerRef.dataChanged$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._cdRef.detectChanges();
      });
  }

  private _listenSideToggle(): void {
    this._drawerRef.sideToggle$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((opened) => {
        this.sideOpen = opened;
      });
  }

  private _listenSideTemplate(): void {
    this._drawerRef.sideTemplate$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((template) => {
        // The BehaviorSubject replays `null` on subscribe, which lands inside ngOnInit —
        // too early to run change detection. Bail on the no-op.
        if (this.sideTemplate === template) {
          return;
        }

        this.sideTemplate = template;
        this._cdRef.detectChanges();
      });
  }
}
