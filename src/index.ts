import {
    StringMonad,
    NumberMonad,
    SymbolMonad,
    ArrayMonad,
    ObjectMonad,
    BooleanMonad,
    NullMonad,
    UndefinedMonad,
    NaNMonad,
    Monad
} from './types';

import { Maybe } from 'simple-maybe';

const _monasteryTypeSymbol = (t: string): symbol =>
    Symbol(`MonasteryMonad::${t}`);

const $$TypeSymbols = {
    $String: _monasteryTypeSymbol('$String'),
    $Number: _monasteryTypeSymbol('$Number'),
    $Symbol: _monasteryTypeSymbol('$Symbol'),
    $Array: _monasteryTypeSymbol('$Array'),
    $Object: _monasteryTypeSymbol('$Object'),
    $Boolean: _monasteryTypeSymbol('$Boolean'),
    $Null: _monasteryTypeSymbol('$Null'),
    $Undefined: _monasteryTypeSymbol('$Undefined'),
    $NaN: _monasteryTypeSymbol('$NaN')
};

/*

//ideas

const $Type = (x: mixed[]): TypeMonad => ({
 ...
});


const $Something = $Type.of(['Stuff', $Object({color: $$String, weight: $$Number})]);

const x = $Something.of({color: 'red', weight: 23.1});

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
    trim: (): StringMonad => $String(x.trim()),
    is: $$TypeSymbols.$String
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
        n === 0 ? $Number(Infinity) : $Number(x / n),
    is: $$TypeSymbols.$Number
});

const $Symbol = (x: symbol = Symbol()): SymbolMonad => ({
    map: (f: Function): SymbolMonad => $Symbol(f(x)),
    chain: <T>(f: Function): T => f(x),
    inspect: (): string => `$Symbol(${String(x)})`,
    join: (): symbol => x,
    is: $$TypeSymbols.$Symbol
});

const $Array = <T>(x: T[]): ArrayMonad<T> => ({
    map: (f: Function): ArrayMonad<T> => $Array(f(x)),
    chain: <U>(f: Function): U => f(x),
    inspect: (): string => `$Array(${x})`,
    join: (): T[] => x,
    is: $$TypeSymbols.$Array
});

const $ObjectDeepValue = <T>(a: {}, p: string[]): Monad<T> =>
    p.reduce(
        (acc, curKey) => acc.map((x: {}) => x[curKey as keyof {}]),
        Maybe.of(a)
    );

const $ObjectPropValue = <T>(a: {}, p: string): Monad<T> =>
    Maybe.of(a[p as keyof {}]);

const $Object = (x: {}): ObjectMonad => ({
    map: (f: Function): ObjectMonad => $Object(f(x)),
    chain: <T>(f: Function): T => f(x),
    inspect: (): string => `$Object(${x})`,
    join: (): {} => x,
    path: (p: string[]): {} => $ObjectDeepValue(x, p),
    prop: (p: string): {} => $ObjectPropValue(x, p),
    is: $$TypeSymbols.$Object
});

const $Boolean = (x: boolean): BooleanMonad => ({
    map: (f: Function): BooleanMonad => $Boolean(f(x)),
    chain: <T>(f: Function): T => f(x),
    inspect: (): string => `$String(${x})`,
    join: (): boolean => x,
    is: $$TypeSymbols.$Boolean
});

const $Null = (): NullMonad => ({
    map: (f: Function): NullMonad => $Null(),
    chain: <T>(f: Function): NullMonad => $Null(),
    inspect: (): string => `$Null()`,
    join: (): NullMonad => $Null(),
    is: $$TypeSymbols.$Null
});

const $Undefined = (): UndefinedMonad => ({
    map: (f: Function): UndefinedMonad => $Undefined(),
    chain: <T>(f: Function): UndefinedMonad => $Undefined(),
    inspect: (): string => `$Undefined()`,
    join: (): UndefinedMonad => $Undefined(),
    is: $$TypeSymbols.$Undefined
});

const $NaN = (): NaNMonad => ({
    map: (f: Function): NaNMonad => $NaN(),
    chain: <T>(f: Function): NaNMonad => $NaN(),
    inspect: (): string => `$NaN()`,
    join: (): NaNMonad => $NaN(),
    is: $$TypeSymbols.$NaN
});

const $StringOf = (x: string): StringMonad => $String(String(x));
const $NumberOf = (x: number): NumberMonad => $Number(Number(x));
const $SymbolOf = (x: symbol): SymbolMonad =>
    typeof x === 'symbol' ? $Symbol(x) : $Symbol();
const $ArrayOf = <T>(x: T[]): ArrayMonad<T> =>
    Array.isArray(x) ? $Array(x) : $Array([x]);
const $ObjectOf = (x: {}): ObjectMonad =>
    x === Object(x) ? $Object(x) : $Object(Object(x));
const $BooleanOf = (x: boolean): BooleanMonad => $Boolean(Boolean(x));
const $NullOf = (): NullMonad => $Null();
const $UndefinedOf = (): UndefinedMonad => $Undefined();
const $NaNOf = (): NaNMonad => $NaN();

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

const export$Null = {
    of: $NullOf
};

const export$Undefined = {
    of: $UndefinedOf
};

const export$NaN = {
    of: $NaNOf
};

const export$$TypeSymbols = $Object($$TypeSymbols);

export {
    export$String as $String,
    export$Number as $Number,
    export$Symbol as $Symbol,
    export$Array as $Array,
    export$Object as $Object,
    export$Boolean as $Boolean,
    export$Null as $Null,
    export$Undefined as $Undefined,
    export$NaN as $NaN,
    export$$TypeSymbols as $$TypeSymbols
};
