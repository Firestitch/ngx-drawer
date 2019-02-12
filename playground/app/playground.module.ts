import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FsExampleModule } from '@firestitch/example';
import { FsDrawerModule } from '@firestitch/drawer';

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
    FsDrawerModule.forRoot(),
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
