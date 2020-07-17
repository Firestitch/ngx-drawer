import { Injectable } from '@angular/core';
import { FsPersistanceStore } from '@firestitch/store';

@Injectable()
export class FsDrawerPersistanceController extends FsPersistanceStore {

  protected STORE_KEY = 'fs-drawer-persist'

}
