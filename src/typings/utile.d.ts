declare type ValueOf<T extends AnyObject = AnyObject> = T[keyof T];

declare type TupleArray<T extends any, len extends number> = [T, ...T[]] & { length: len };
