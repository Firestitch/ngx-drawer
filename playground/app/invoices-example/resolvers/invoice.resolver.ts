import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { RouteSubject } from '@firestitch/core';

import { Observable } from 'rxjs';

import { InvoicesService } from '../services/invoices.service';


@Injectable({
  providedIn: 'root',
})
export class InvoiceResolver  {
  private _invoicesService = inject(InvoicesService);


  public resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const routeSubject = new RouteSubject();

    return routeSubject.observe(this._invoicesService.get(+route.params.id));
  }

}
