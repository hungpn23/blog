// see: https://egghead.io/blog/using-branded-types-in-typescript
declare const __brand: unique symbol;
type Brand<B> = { [__brand]: B };
type Branded<T, B> = T & Brand<B>;

export type Uuid = Branded<string, 'uuid'>;
export type Seconds = Branded<number, 'seconds'>;
export type Milliseconds = Branded<number, 'milliseconds'>;
