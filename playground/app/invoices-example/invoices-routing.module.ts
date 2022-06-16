import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { fsDrawerRoute } from 'fs-package';

import { InvoicesComponent } from './components/invoices';
import { InvoiceDrawerComponent } from './components/invoice-drawer';
import { InvoiceResolver } from './resolvers/invoice.resolver';

const routes: Route[] = [
  {
    path: '',
    component: InvoicesComponent,
    children: [
      fsDrawerRoute(
        {
          path: 'invoices/:id',
          component: InvoiceDrawerComponent,
          data: {},
          resolve: {
            invoice: InvoiceResolver,
          },
        }
      )
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class InvoicesRoutingModule {}
