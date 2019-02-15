import {
    StringMonad,
    NumberMonad,
    SymbolMonad,
    ArrayMonad,
    ObjectMonad,
    BooleanMonad,
    Monad
} from './types';

// @todo Symbols for each type; e.g. $$isString or somesuch

/*
use for detected monad maybe?
const isString = (x: unknown) =>
    Object.prototype.toString.call(x) === '[object String]';
*/

const $String = (x: string): StringMonad => ({
    map: (f: Function): StringMonad => $String(f(x)),
    chain: <T>(f: Function): T => f(x),
    inspect: (): string => `$String(${x})`,
    join: (): string => x,
    prepend: (s: string): StringMonad => $String(`${s}${x}`),
    append: (s: string): StringMonad => $String(`${x}${s}`),
    substring: (i: number, j?: number): StringMonad =>
        // so x.substring does weird things when i > j; do we want to fix that? Or be consistent with method?
        $String(x.substring(i, j || Infinity)),
    trim: (): StringMonad => $String(x.trim())
});

const $Number = (x: number): NumberMonad => ({
    map: (f: Function): NumberMonad => $Number(f(x)),
    chain: <T>(f: Function): T => f(x),
    inspect: (): string => `$Number(${x})`,
    join: (): number => x,
    increment: (n = 1): NumberMonad => $Number(x + n),
    decrement: (n = 1): NumberMonad => $Number(x - n),
    add: (n: number): NumberMonad => $Number(x + n),
    subtract: (n: number): NumberMonad => $Number(x - n),
    multiply: (n: number): NumberMonad => $Number(x * n),
    divide: (n: number): NumberMonad =>
        n === 0 ? $Number(Infinity) : $Number(x / n)
});

const $Symbol = (x: symbol = Symbol()): SymbolMonad => ({
    map: (f: Function): SymbolMonad => $Symbol(f(x)),
    chain: <T>(f: Function): T => f(x),
    inspect: (): string => `$Symbol(${String(x)})`,
    join: (): symbol => x
});

const $Array = <T>(x: T[]): ArrayMonad<T> => ({
    map: (f: Function): ArrayMonad<T> => $Array(f(x)),
    chain: <U>(f: Function): U => f(x),
    inspect: (): string => `$Array(${x})`,
    join: (): T[] => x,
});

const $Object = (x: {}): ObjectMonad => ({
    map: (f: Function): ObjectMonad => $Object(f(x)),
    chain: <T>(f: Function): T => f(x),
    inspect: (): string => `$Object(${x})`,
    join: (): {} => x
});

const $Boolean = (x: boolean): BooleanMonad => ({
    map: (f: Function): BooleanMonad => $Boolean(f(x)),
    chain: <T>(f: Function): T => f(x),
    inspect: (): string => `$String(${x})`,
    join: (): boolean => x
});

// idea: Undefined/Null as a Nothing() -- used with some kind of type detection entrypoint

const $StringOf = (x: string): StringMonad => $String(String(x));
const $NumberOf = (x: number): NumberMonad => $Number(Number(x));
const $SymbolOf = (x: symbol): SymbolMonad =>
    typeof x === 'symbol' ? $Symbol(x) : $Symbol();
const $ArrayOf = <T>(x: T[]): ArrayMonad<T> =>
    Array.isArray(x) ? $Array(x) : $Array([x]);
const $ObjectOf = (x: {}): ObjectMonad =>
    x === Object(x) ? $Object(x) : $Object(Object(x));
const $BooleanOf = (x: boolean): BooleanMonad => $Boolean(Boolean(x));

const export$Number = {
    of: $NumberOf
};

const export$String = {
    of: $StringOf
};

const export$Symbol = {
    of: $SymbolOf
};

const export$Array = {
    of: $ArrayOf
};

const export$Object = {
    of: $ObjectOf
};

const export$Boolean = {
    of: $BooleanOf
};

export {
    export$String as $String,
    export$Number as $Number,
    export$Symbol as $Symbol,
    export$Array as $Array,
    export$Object as $Object,
    export$Boolean as $Boolean
};
