import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import {
  BasePortalOutlet,
  CdkPortalOutlet,
  ComponentPortal,
  TemplatePortal,
} from '@angular/cdk/portal';

import { getNormalizedPath } from '@firestitch/common';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DrawerRef } from '../../classes/drawer-ref';
import { DrawerSizeController } from '../../classes/drawer-size-controller';
import { FsDrawerPersistanceController } from '../../classes/persistance-controller';
import { DrawerConfig } from '../../models/drawer-config.model';
import { FsDrawerMenuService } from '../../services/drawer-menu.service';


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
})
export class FsDrawerComponent extends BasePortalOutlet implements OnInit, OnDestroy {

  public config: DrawerConfig;
  public isOpen = false;
  public isOpenSide = false;

  @ViewChild(CdkPortalOutlet, { static: true })
  private _portalOutlet: CdkPortalOutlet;

  @ViewChild('drawerContainer', { static: true })
  private _drawerContainer: ElementRef;

  @ViewChild('drawerActionsContainer', { read: ElementRef, static: true })
  private _drawerActionsContainer: ElementRef;

  private _sideOpen = false;
  private _destroy$ = new Subject();

  constructor(
    private _el: ElementRef<HTMLElement>,
    private _drawerRef: DrawerRef<any>,
    private _cdRef: ChangeDetectorRef,
    private _resizeController: DrawerSizeController,
    private _persistanceController: FsDrawerPersistanceController,
    private _location: Location,
  ) {
    super();
    this._drawerRef.resizeController = this._resizeController;
  }

  public get drawerRef(): DrawerRef<unknown> {
    return this._drawerRef;
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

    // Need to be like a parent for children resize
    this._drawerRef.drawerContainer = this._drawerContainer;
    this._drawerRef.drawerActionsContainer = this._drawerActionsContainer;

    this.config = this._drawerRef.drawerConfig;
    if (this.config.persist) {
      const namespace = getNormalizedPath(this._location);
      this._persistanceController.setConfig(this.config.persist, namespace);
    }

    this._resizeController.init();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
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

    return this._portalOutlet.attachComponentPortal(portal);
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
}
