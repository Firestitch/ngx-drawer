import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatTooltipModule, MatButtonModule, MatMenuModule, MatIconModule } from '@angular/material';

import { FsMenuModule } from '@firestitch/menu';

import { FsDrawerActionsComponent } from './components/drawer-actions/drawer-actions.component';
import { FsDrawerComponent } from './components/drawer/drawer.component';
import { FsDrawerSideComponent } from './components/drawer-side/drawer-side.component';
import { FsDrawerMenuComponent } from './components/drawer-menu/drawer-menu.component';

import { FsDrawerContentComponent } from './components/drawer-content/drawer-content.component';
import { FsDrawerActionDirective } from './directives/drawer-action.directive';
import { FsDrawerResizerDirective } from './directives/drawer-resizer.directive';

import { FsDrawerService } from './services/drawer.service';


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
  entryComponents: [
    FsDrawerComponent,
    FsDrawerMenuComponent,
  ],
  declarations: [
    FsDrawerSideComponent,
    FsDrawerComponent,
    FsDrawerActionsComponent,
    FsDrawerContentComponent,
    FsDrawerActionDirective,
    FsDrawerResizerDirective,
    FsDrawerMenuComponent,
  ],
  providers: [FsDrawerService],
})
export class FsDrawerModule {}
