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

  return {
    path,
    component: FsDrawerRouteComponent,
    ...restRoute,
    data: {
      fsDrawer: {
        component,
        config: {
          data,
          ...restDrawerConfig,
        },
      },
    },
  };

}
