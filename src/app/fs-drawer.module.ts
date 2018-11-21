import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatTooltipModule, MatButtonModule, MatMenuModule } from '@angular/material';

import { FsMenuModule } from '@firestitch/menu';

import { FsDrawerActionsComponent } from './components/drawer-actions/drawer-actions.component';
import { FsDrawerComponent } from './components/drawer/drawer.component';
import { FsDrawerSideComponent } from './components/drawer-side/drawer-side.component';

import { FsDrawerContentDirective } from './directives/drawer-content.directive';
import { FsDrawerActionDirective } from './directives/drawer-action.directive';
import { FsDrawerResizerDirective } from './directives/drawer-resizer.directive';

import { FsDrawerService } from './services/drawer.service';


@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    MatButtonModule,
    OverlayModule,
    PortalModule,
    FsMenuModule,
    MatMenuModule,
  ],
  exports: [
    FsDrawerComponent,
    FsDrawerSideComponent,
    FsDrawerContentDirective,
    FsDrawerActionDirective,
    FsDrawerResizerDirective,
  ],
  entryComponents: [
    FsDrawerComponent,
  ],
  declarations: [
    FsDrawerSideComponent,
    FsDrawerComponent,
    FsDrawerActionsComponent,
    FsDrawerContentDirective,
    FsDrawerActionDirective,
    FsDrawerResizerDirective,
  ],
  providers: [
    FsDrawerService,
  ],
})
export class FsDrawerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FsDrawerModule,
      providers: [FsDrawerService]
    };
  }
}
