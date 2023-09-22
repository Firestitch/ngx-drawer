import { NgModule } from '@angular/core';
import { FlexModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { FsCheckboxGroupModule } from '@firestitch/checkboxgroup';
import { FsExampleModule } from '@firestitch/example';
import { FsLabelModule } from '@firestitch/label';
import { FsMessageModule } from '@firestitch/message';
import { DRAWER_DEFAULT_CONFIG, FsDrawerModule } from 'fs-package';

import { AppMaterialModule } from './material.module';

import { FsStoreModule } from '@firestitch/store';
import {
  AppComponent,
  ExampleComponent,
  ExamplesComponent,
  FsDrawerExampleComponent,
  TaskDrawerComponent,
} from './components';
import { CustomMenuComponent } from './components/fs-drawer-example/custom-menu';
import { NavigationComponent } from './components/navigation';


@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FsExampleModule.forRoot(),
    RouterModule.forRoot([
      {
        path: '',
        loadChildren: () => import('./invoices-example/invoices.module').then(m => m.InvoicesModule),
      },
    ]),
    FsDrawerModule,
    FsMessageModule.forRoot(),
    FsStoreModule.forRoot(),
    FsCheckboxGroupModule,
    FsLabelModule,
    FlexModule,
  ],
  entryComponents: [
    TaskDrawerComponent,
    CustomMenuComponent,
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    ExampleComponent,
    FsDrawerExampleComponent,
    TaskDrawerComponent,
    CustomMenuComponent,
    NavigationComponent,
  ],
  providers: [
    {
      provide: DRAWER_DEFAULT_CONFIG,
      useValue: {
        width: {
          side: {
            min: 300,
          },
        },
      },
    }
  ],
})
export class PlaygroundModule {
}
