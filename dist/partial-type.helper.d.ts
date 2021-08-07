import { MappedType } from './mapped-type.interface';
import { Type } from './type.interface';
export declare function PartialType<T>(classRef: Type<T>): MappedType<Partial<T>>;
