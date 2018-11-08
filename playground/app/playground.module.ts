import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
    FsDrawerModule,
  ],
  entryComponents: [
    TaskDrawerComponent
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    ExampleComponent,
    FsDrawerExampleComponent,
    TaskDrawerComponent
  ],
  providers: [
  ],
})
export class PlaygroundModule {
}
