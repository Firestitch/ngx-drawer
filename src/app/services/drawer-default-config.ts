import { InjectionToken } from '@angular/core';
import { IDrawerConfig } from '../interfaces/drawer-config.interface';

export const DRAWER_DEFAULT_CONFIG = new InjectionToken<IDrawerConfig>('fs.drawer-default-config');
