import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FsExampleModule } from '@firestitch/example';
import { FsDrawerModule } from 'fs-package';
import { FsCheckboxGroupModule } from '@firestitch/checkboxgroup';
import { FsMessageModule } from '@firestitch/message';
import { FsLabelModule } from '@firestitch/label';

import { ToastrModule } from 'ngx-toastr';

import { AppMaterialModule } from './material.module';

import {
  AppComponent,
  ExampleComponent,
  ExamplesComponent,
  FsDrawerExampleComponent,
  TaskDrawerComponent,
} from './components';
import { CustomMenuComponent } from './components/fs-drawer-example/custom-menu';


const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [ AppComponent ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FsExampleModule.forRoot(),
    RouterModule.forRoot(routes),
    FsDrawerModule,
    ToastrModule.forRoot({ preventDuplicates: true }),
    FsMessageModule.forRoot(),
    FsCheckboxGroupModule,
    FsLabelModule,
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
  ],
  providers: [
  ],
})
export class PlaygroundModule {
}
