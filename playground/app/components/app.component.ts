import { ChangeDetectionStrategy, Component } from '@angular/core';

import { environment } from 'playground/environments/environment';
import { FsExampleModule } from '@firestitch/example';
import { FsDrawerExampleComponent } from './fs-drawer-example/fs-drawer-example.component';
import { NavigationComponent } from './navigation/navigation.component';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FsExampleModule,
        FsDrawerExampleComponent,
        NavigationComponent,
    ],
})
export class AppComponent {

  public config = environment;
}
