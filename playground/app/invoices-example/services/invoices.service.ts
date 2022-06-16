import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { delay, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class InvoicesService {
  private _invoices = [
    {
      id: 1,
      name: 'Invoice 1',
      amount: 14,
    },
    {
      id: 2,
      name: 'Invoice 2',
      amount: 14,
    },
    {
      id: 3,
      name: 'Invoice 3',
      amount: 14,
    },
    {
      id: 4,
      name: 'Invoice 4',
      amount: 14,
    },
    {
      id: 5,
      name: 'Invoice 5',
      amount: 14,
    },
    {
      id: 6,
      name: 'Invoice 6',
      amount: 14,
    },
    {
      id: 7,
      name: 'Invoice 7',
      amount: 14,
    },
  ];

  public gets(): Observable<any> {
    return of(this._invoices);
  };

  public get(id: number): Observable<any> {
    const invoice = this._invoices.find((item) => item.id === id);

    return of(invoice);
  }

  public save(invoice: any) {
    const invoiceIndex = this._invoices.findIndex((item) => item.id === invoice.id);
    this._invoices[invoiceIndex] = { ...invoice };

    return of(invoice);
  }

  public create(invoice: any) {
    this._invoices.push({ ...invoice });
  }

}
