import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FsMenuModule } from '@firestitch/menu';

import { FsDrawerActionsComponent } from './components/drawer-actions/drawer-actions.component';
import { FsDrawerComponent } from './components/drawer/drawer.component';
import { FsDrawerSideComponent } from './components/drawer-side/drawer-side.component';
import { FsDrawerMenuComponent } from './components/drawer-menu/drawer-menu.component';
import { FsDrawerActionItemComponent } from './components/drawer-actions/drawer-action-item/drawer-action-item.component';

import { FsDrawerContentComponent } from './components/drawer-content/drawer-content.component';
import { FsDrawerActionDirective } from './directives/drawer-action.directive';

import { FsDrawerResizerDirective } from './directives/drawer-resizer.directive';


@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    OverlayModule,
    PortalModule,
    FsMenuModule,
    MatMenuModule,
  ],
  exports: [
    FsDrawerComponent,
    FsDrawerSideComponent,
    FsDrawerContentComponent,
    FsDrawerActionDirective,
    FsDrawerResizerDirective,
  ],
  declarations: [
    FsDrawerSideComponent,
    FsDrawerComponent,
    FsDrawerActionsComponent,
    FsDrawerActionItemComponent,
    FsDrawerContentComponent,
    FsDrawerActionDirective,
    FsDrawerResizerDirective,
    FsDrawerMenuComponent,
  ],
})
export class FsDrawerModule {}
