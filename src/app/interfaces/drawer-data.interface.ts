import { Observable } from 'rxjs';

type Proxy<T> = {
  get(): T;
  set(value: T): void;
}

type Proxify<T> = {
  [P in keyof T]: Proxy<T[P]>;
}

interface IDrawerData<T> {
  dataChange$: Observable<void>;
  getValue(): T;
  setValue(value: any): void;
  destroy(): void;
}

export type DrawerDataProxy<T> = IDrawerData<T> & Proxify<T>;
