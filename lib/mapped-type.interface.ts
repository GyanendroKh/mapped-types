import { Type } from './type.interface';

export interface MappedType<T> extends Type<T> {
  new (): T;
}
