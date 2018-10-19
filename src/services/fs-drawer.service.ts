import { ComponentFactoryResolver, Injectable, Type, ViewContainerRef } from '@angular/core';
import { ComponentReference } from './component-reference';
import {Drawer} from '../components/fs-drawer/classes/drawer';

@Injectable()
export class FsDrawerService {
  private _currentDrawer: ComponentReference;

  constructor(private _componentFactoryResolver: ComponentFactoryResolver) {

  }

  public open(viewContainerRef: ViewContainerRef,
             component: Type<any>,
             data: any) {

    // component creates dynamicly
    const cFactory = this._componentFactoryResolver.resolveComponentFactory(component);
    const componentRef = viewContainerRef.createComponent(cFactory);
    const reference = new ComponentReference(componentRef);
    reference.data = data;
    this._currentDrawer = reference;

    return new Drawer(this.currentDrawer.ref);
  }

  public close() {

  }


}
