import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FsFormModule } from '@firestitch/form';
import { FsLabelModule } from '@firestitch/label';
import { FsListModule } from '@firestitch/list';



import { InvoiceDrawerComponent } from './components/invoice-drawer';
import { InvoicesComponent } from './components/invoices';
import { InvoicesRoutingModule } from './invoices-routing.module';


@NgModule({
    imports: [
    CommonModule,
    FsListModule,
    FsFormModule,
    InvoicesRoutingModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    FsLabelModule,
    InvoicesComponent,
    InvoiceDrawerComponent,
],
})
export class InvoicesModule {}
