/*
 * Public API Surface of fs-menu
 */

export { FsDrawerModule } from './app/fs-drawer.module';

export { FsDrawerService } from './app/services/drawer.service';
export { DRAWER_DATA } from './app/services/drawer-data';
export { DRAWER_MENU_DATA } from './app/services/drawer-menu-data';

export { DrawerRef } from './app/classes/drawer-ref';
export { DrawerMenuRef } from './app/classes/drawer-menu-ref';

export { DrawerData } from './app/classes/drawer-data';

export { IDrawerConfig } from './app/interfaces/drawer-config.interface';
export { DrawerDataProxy } from './app/interfaces/drawer-data.interface';
export { IFsDrawerActionConfig } from './app/interfaces/action.iterface';

export { FsDrawerAction } from './app/helpers/action-type.enum';
