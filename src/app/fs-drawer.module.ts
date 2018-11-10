import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatTooltipModule } from '@angular/material';

import { FsMenuModule } from '@firestitch/menu';

import { FsDrawerActionsComponent, FsDrawerComponent, FsDrawerSideComponent } from './components';
import { FsDrawerContentDirective, FsDrawerActionDirective } from './directives';
import { FsDrawerService } from './services';


@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    OverlayModule,
    PortalModule,
    FsMenuModule,
  ],
  exports: [
    FsDrawerComponent,
    FsDrawerSideComponent,
    FsDrawerContentDirective,
    FsDrawerActionDirective,
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
