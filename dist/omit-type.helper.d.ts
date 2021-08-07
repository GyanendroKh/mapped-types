import { MappedType } from './mapped-type.interface';
import { Type } from './type.interface';
export declare function OmitType<T, K extends keyof T>(classRef: Type<T>, keys: readonly K[]): MappedType<Omit<T, typeof keys[number]>>;
