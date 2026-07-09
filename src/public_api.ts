/*
 * Public API Surface of fs-menu
 */



export { FsDrawerComponent } from './app/components/drawer/drawer.component';
export { FsDrawerSideComponent } from './app/components/drawer-side/drawer-side.component';
export { FsDrawerActionDirective } from './app/directives/drawer-action.directive';
export { FsDrawerContentDirective } from './app/directives/drawer-content.directive';
export { FsDrawerResizerDirective } from './app/directives/drawer-resizer.directive';

/**
 * @deprecated Use `FsDrawerContentDirective`. This is the same class under its old name,
 * so an existing `imports: [FsDrawerContentComponent]` keeps compiling — Angular resolves
 * the class, not the identifier it arrived under. `[fsDrawerContent]` has always been an
 * attribute selector, so templates were never affected either.
 *
 * The region's markup did change, and no compiler will say so: it used to render a
 * `.content-container` host wrapping a `.content` div that carried the padding. It is now
 * a single element — the consumer's own — with `.drawer-content-body` on it. Stylesheets
 * reaching for either old class silently stop matching.
 */
export { FsDrawerContentDirective as FsDrawerContentComponent } from './app/directives/drawer-content.directive';

export { FsDrawerService } from './app/services/drawer.service';
export { DRAWER_DATA } from './app/services/drawer-data';
export { DRAWER_MENU_DATA } from './app/services/drawer-menu-data';
export { DRAWER_DEFAULT_CONFIG } from './app/services/drawer-default-config';

export { DrawerRef } from './app/classes/drawer-ref';
export { DrawerMenuRef } from './app/classes/drawer-menu-ref';

export { DrawerData } from './app/classes/drawer-data';

export { FsDrawerMode, IDrawerConfig } from './app/interfaces/drawer-config.interface';
export { DrawerDataProxy } from './app/interfaces/drawer-data.interface';
export { IFsDrawerActionConfig } from './app/interfaces/action.iterface';
export { IDrawerComponent } from './app/interfaces/drawer-component.interface';

export { FsDrawerAction } from './app/helpers/action-type.enum';
export { fsDrawerRoute } from './app/helpers/drawer-route';
export { FsDrawerUrlService } from './app/services/drawer-url.service';
