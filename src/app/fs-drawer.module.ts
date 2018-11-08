import { NgModule, ModuleWithProviders } from '@angular/core';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { FsDrawerComponent } from './components/fs-drawer/fs-drawer.component';
import { FsDrawerService } from './services';

import { MatTooltipModule } from '@angular/material';
import { FsDrawerSide } from './directives/drawer-side.directive';
import { FsDrawerContent } from './directives/drawer-content.directive';


@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    OverlayModule,
    PortalModule,
  ],
  exports: [
    FsDrawerComponent,
    FsDrawerSide,
    FsDrawerContent,
  ],
  entryComponents: [
    FsDrawerComponent,
  ],
  declarations: [
    FsDrawerComponent,
    FsDrawerSide,
    FsDrawerContent,
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
