export interface Monad<T> {
    map: (f: Function) => Monad<T>;
    chain: <U>(f: Function) => Monad<U>;
    join: () => T;
    inspect: () => string;
}

export interface StringMonad extends Monad<string> {
    prepend: (s: string) => StringMonad;
    append: (s: string) => StringMonad;
    substring: (i: number, j?: number) => StringMonad;
    trim: () => StringMonad;
}

export interface NumberMonad extends Monad<number> {
    increment: (by?: number) => NumberMonad;
    decrement: (by?: number) => NumberMonad;
    add: (by: number) => NumberMonad;
    subtract: (by: number) => NumberMonad;
    multiply: (by: number) => NumberMonad;
    divide: (by: number) => NumberMonad;
}

export interface ObjectMonad extends Monad<object> {}
export interface SymbolMonad extends Monad<symbol> {}
export interface BooleanMonad extends Monad<boolean> {}
export interface ArrayMonad<T> extends Monad<T[]> {}
