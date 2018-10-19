import { FsDrawerComponent } from '../fs-drawer.component';

export class Drawer {

  constructor(private _drawer: FsDrawerComponent) {
    console.log(this._drawer);
  }

  public open() {

  }

  public close() {
    this._drawer.close();
  }

}

