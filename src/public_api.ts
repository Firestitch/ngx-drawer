/*
 * Public API Surface of fs-menu
 */

export { FsDrawerModule } from './app/fs-drawer.module';

export { FsDrawerComponent } from './app/components/drawer/drawer.component';
export { FsDrawerSideComponent } from './app/components/drawer-side/drawer-side.component';
export { FsDrawerContentComponent } from './app/components/drawer-content/drawer-content.component';
export { FsDrawerActionDirective } from './app/directives/drawer-action.directive';
export { FsDrawerResizerDirective } from './app/directives/drawer-resizer.directive';

export { FsDrawerService } from './app/services/drawer.service';
export { DRAWER_DATA } from './app/services/drawer-data';
export { DRAWER_MENU_DATA } from './app/services/drawer-menu-data';
export { DRAWER_DEFAULT_CONFIG } from './app/services/drawer-default-config';

export { DrawerRef } from './app/classes/drawer-ref';
export { DrawerMenuRef } from './app/classes/drawer-menu-ref';

export { DrawerData } from './app/classes/drawer-data';

export { IDrawerConfig } from './app/interfaces/drawer-config.interface';
export { DrawerDataProxy } from './app/interfaces/drawer-data.interface';
export { IFsDrawerActionConfig } from './app/interfaces/action.iterface';
export { IDrawerComponent } from './app/interfaces/drawer-component.interface';

export { FsDrawerAction } from './app/helpers/action-type.enum';
export { fsDrawerRoute } from './app/helpers/drawer-route';
export { FsDrawerUrlService } from './app/services/drawer-url.service';
