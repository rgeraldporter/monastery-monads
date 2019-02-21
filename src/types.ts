export const $$ReflectionSymbol = Symbol('ReflectMonasteryType');

export interface Monad<T> {
    map: (f: Function) => Monad<T>;
    chain: <U>(f: Function) => Monad<U>;
    join: () => T;
    inspect: () => string;
    readonly is: symbol;
}

export interface NothingMonad {
    map: (f: Function) => NothingMonad;
    chain: (f: Function) => NothingMonad;
    join: () => NothingMonad;
    inspect: () => string;
    readonly is: symbol;
}

export type PrimativeMonad =
    | NumberMonad
    | StringMonad
    | ObjectMonad
    | BooleanMonad
    | SymbolMonad
    | NullMonad
    | UndefinedMonad
    | NaNMonad
    ;

export interface MonasteryTypeValue {
    [key: string]: PrimativeMonad | NothingMonad;
}

export interface MonasteryUntypeValue {
    [key: string]: MonasteryMonadTypePropertyValues;
}

export interface TypeMonad {
    map: (f: Function) => TypeMonad;
    chain: <U>(f: Function) => Monad<U>;
    join: () => MonasteryMonadPropsConstructor;
    inspect: () => string;
    readonly is: symbol;
    extend: <V extends TypeMonad>(f: Function) => V;
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
    equals: (n: number) => boolean;
}

export interface ObjectMonad extends Monad<object> {
    path: Function;
    prop: Function;
}

export interface SymbolMonad extends Monad<symbol> {}
export interface BooleanMonad extends Monad<boolean> {}
export interface ArrayMonad<T> extends Monad<T[]> {}

export interface NullMonad extends NothingMonad {}
export interface UndefinedMonad extends NothingMonad {}
export interface NaNMonad extends NothingMonad {}

export type MonasteryMonadTypePropertyValues =
    | string
    | number
    | boolean
    | number;

export type MonasteryMonadTypePropertyValuesIntersection = string &
    number &
    boolean &
    number;

export type MonasteryTypeParameters = {
    [key: string]: MonasteryMonadTypePropertyValues;
};

export type MonasteryMonadTypeParameters = {
    [key: string]: PrimativeMonad;
};

export type MonasteryUnknownParameters = {
    [key: string]: unknown;
};

export type MonasteryMonadPropsConstructor = {
    [key: string]: MonasteryMonadConstructor;
};

export type MonasteryMonadConstructor = {
    of: (x: MonasteryMonadTypePropertyValuesIntersection) => PrimativeMonad;
    [$$ReflectionSymbol]: string;
    assert: Function;
    check: Function;
};

export type TypeMethods = {
    [key: string]: Function | symbol;
};

export type MonasteryMonadMethodsFunction = (
    x: MonasteryUnknownParameters
) => TypeMethods;

export type CreateTypeValue = {
    methods: MonasteryMonadMethodsFunction;
    name: string;
    props: MonasteryMonadPropsConstructor;
};

export type MonasteryTypeConstructorTuple = [
    string,
    MonasteryMonadPropsConstructor,
    MonasteryMonadMethodsFunction
];

// NaN is missing from TS; Technically it's a number.
export type NaNType = number;