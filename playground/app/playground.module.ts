import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FsExampleModule } from '@firestitch/example';
import { FsDrawerModule } from '@firestitch/drawer';
import { FsCheckboxGroupModule } from '@firestitch/checkboxgroup';

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
    FormsModule,
    FsExampleModule.forRoot(),
    RouterModule.forRoot(routes),
    FsDrawerModule.forRoot(),
    FsCheckboxGroupModule,
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
