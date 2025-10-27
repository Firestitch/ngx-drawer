import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { DRAWER_DEFAULT_CONFIG } from 'fs-package';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FsExampleModule } from '@firestitch/example';
import { provideRouter } from '@angular/router';
import { FsMessageModule } from '@firestitch/message';
import { FsStoreModule } from '@firestitch/store';
import { FsCheckboxGroupModule } from '@firestitch/checkboxgroup';
import { FsLabelModule } from '@firestitch/label';
import { AppComponent } from './app/components/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FsExampleModule.forRoot(), FsMessageModule.forRoot(), FsStoreModule.forRoot(), FsCheckboxGroupModule, FsLabelModule),
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
        provideAnimations(),
        provideRouter([
            {
                path: '',
                loadChildren: () => import("./app/invoices-example/invoices.module").then((m) => m.InvoicesModule),
            },
        ])
    ]
})
  .catch(err => console.error(err));

