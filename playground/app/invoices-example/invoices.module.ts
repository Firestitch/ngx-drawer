import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexModule } from '@angular/flex-layout';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FsFormModule } from '@firestitch/form';
import { FsListModule } from '@firestitch/list';
import { FsLabelModule } from '@firestitch/label';
import { FsDrawerModule } from 'fs-package';

import { InvoicesRoutingModule } from './invoices-routing.module';
import { InvoicesComponent } from './components/invoices';
import { InvoiceDrawerComponent } from './components/invoice-drawer';



@NgModule({
  imports: [
    CommonModule,
    FsListModule,
    FsDrawerModule,
    FsFormModule,

    InvoicesRoutingModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    FlexModule,
    FsLabelModule,
  ],
  declarations: [
    InvoicesComponent,
    InvoiceDrawerComponent,
  ],
})
export class InvoicesModule {}
