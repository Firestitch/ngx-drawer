import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { FsCheckboxGroupModule } from '@firestitch/checkboxgroup';
import { FsExampleModule } from '@firestitch/example';
import { FsLabelModule } from '@firestitch/label';
import { FsMessageModule } from '@firestitch/message';
import { FsStoreModule } from '@firestitch/store';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DRAWER_DEFAULT_CONFIG, FsDrawerModule } from 'fs-package';

import {
  AppComponent,
  ExampleComponent,
  FsDrawerExampleComponent,
  TaskDrawerComponent,
} from './components';
import { CustomMenuComponent } from './components/fs-drawer-example/custom-menu';
import { NavigationComponent } from './components/navigation';
import { AppMaterialModule } from './material.module';


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
        loadChildren: () => import('./invoices-example/invoices.module').then((m) => m.InvoicesModule),
      },
    ]),
    FsDrawerModule,
    FsMessageModule.forRoot(),
    FsStoreModule.forRoot(),
    FsCheckboxGroupModule,
    FsLabelModule,
  ],
  entryComponents: [
    TaskDrawerComponent,
    CustomMenuComponent,
  ],
  declarations: [
    AppComponent,
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
    },
  ],
})
export class PlaygroundModule {
}
