import { NgModule, ModuleWithProviders } from '@angular/core';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { FsDrawerComponent } from './components/fs-drawer/fs-drawer.component';
import { FsDrawerService } from './services';

import { MatTooltipModule } from '@angular/material';


@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    OverlayModule,
    PortalModule,
  ],
  exports: [
    FsDrawerComponent,
  ],
  entryComponents: [
    FsDrawerComponent,
  ],
  declarations: [
    FsDrawerComponent,
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
