import { Route } from '@angular/router';

import { FsDrawerRouteComponent } from '../components/route/route.component';
import { IDrawerConfig } from '../interfaces/drawer-config.interface';


export function fsDrawerRoute(route: Route, drawerConfig?: IDrawerConfig): Route {

  const {
    path,
    component,
    data: routeData,
    ...restRoute
  } = route;

  const { data: drawerData, ...restDrawerConfig } = drawerConfig || {};

  const data = {
    ...(routeData || {}),
    ...(drawerData || {}),
  };

  // Flat beside the component: FsDrawerRouteComponent passes everything but the
  // component straight to FsDrawerService.open() as the drawer config, so settings
  // nested one level down (actions, width, position) never reach the drawer.
  return {
    path,
    component: FsDrawerRouteComponent,
    ...restRoute,
    data: {
      fsDrawer: {
        component,
        data,
        ...restDrawerConfig,
      },
    },
  };

}
