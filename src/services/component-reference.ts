import { ComponentRef } from '@angular/core';

export class ComponentReference {

  constructor(private _componentReference: ComponentRef<any>) {
  }

  get ref() {
    return this._componentReference.instance.drawer;
  }

  set data(data: any) {
    this._componentReference.instance.data = data;
  }

  public remove() {
    this._componentReference.destroy();
  }
}
