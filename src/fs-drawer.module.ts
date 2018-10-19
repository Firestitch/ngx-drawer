import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FsDrawerComponent } from './components/fs-drawer/fs-drawer.component';
import { FsDrawerService } from './services';

import { MatTooltipModule } from '@angular/material';


@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule
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
      // providers: [FsDrawerService]
    };
  }
}
