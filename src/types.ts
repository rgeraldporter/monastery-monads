export const $$TypeReflectionSymbol = Symbol('ReflectMonasteryType');
export const $$MonasteryMonadSymbol = Symbol('MonasteryMonad');
export const $$MonasteryTypeMonadSymbol = Symbol('MonasteryTypeMonad');

export type ChainFunction<A> = (a: A) => A;


export interface Monad<T> {
    //map: <B>(f: (x?: T) => B) => Monad<B>;
    map: (f: Function) => Monad<T>;
    chain: (f: Function) => Monad<unknown>;
    // joins and unwraps you can't really know what they're going to spit out...
    // tslint:disable-next-line:no-any
    join: () => any;
    // tslint:disable-next-line:no-any
    emit: () => any;
    // tslint:disable-next-line:no-any
    unwrap: () => any;
    inspect: () => string;
    defaultTo: (x: unknown) => Monad<unknown>;
    readonly is: symbol;
    [$$MonasteryMonadSymbol]: true;
}

export interface NullableMonad {
    map: (f: Function) => NullableMonad;
    chain: (f: Function) => NullableMonad;
    join: () => NullableMonad;
    unwrap: () => NullableMonad;
    emit: () => NullableMonad;
    inspect: () => string;
    defaultTo: (a: unknown) => NullableMonad;
    readonly is: symbol;
    [$$MonasteryMonadSymbol]: true;
}

export interface NothingMonad extends Monad<unknown> {
    join: () => NothingMonad;
    emit: () => NothingMonad;
    unwrap: () => NothingMonad;
    inspect: () => string;
    fork: <T>(f: Function, g: Function) => T;
    as: <ValueT, MonadT>(a: MonasteryMonadConstructor<ValueT, MonadT>) => MonadT;
    readonly is: symbol;
    [$$MonasteryMonadSymbol]: true;
}

export interface JustMonad extends Monad<unknown> {
    fork: <T>(f: Function, g: Function) => T;
    as: <ValueT, MonadT>(a: MonasteryMonadConstructor<ValueT, MonadT>) => MonadT;
    defaultTo: <ValueT>(x: ValueT) => Monad<ValueT>;
}

export type MaybeMonad = JustMonad & NothingMonad;

export type PrimativeMonad =
    | NumberMonad
    | StringMonad
    | ObjectMonad
    | BooleanMonad
    | SymbolMonad
    | NullMonad
    | UndefinedMonad
    | NaNMonad;

export interface MonasteryTypeValue {
    [key: string]: PrimativeMonad | NullableMonad;
}

export interface MonasteryUntypeValue {
    [key: string]: MonasteryMonadTypePropertyValues;
}

export interface TypeMonad {
    map: (f: Function) => TypeMonad;
    chain: <U>(f: Function) => Monad<U>;
    join: () => MonasteryMonadPropsConstructor;
    emit: () => MonasteryMonadPropsConstructor;
    unwrap: () => MonasteryMonadPropsConstructor;
    inspect: () => string;
    readonly is: symbol;
    extend: <V extends TypeMonad>(f: Function) => V;
    defaultTo: (a: unknown) => TypeMonad;
    [$$MonasteryMonadSymbol]: true;
    [$$MonasteryTypeMonadSymbol]: true;
}

export interface StringMonad extends Monad<string> {
    prepend: (s: string) => StringMonad;
    append: (s: string) => StringMonad;
    substring: (i: number, j?: number) => StringMonad;
    trim: () => StringMonad;
    defaultTo: (a: unknown) => StringMonad;
}

export interface NumberMonad extends Monad<number> {
    increment: (by?: number) => NumberMonad;
    decrement: (by?: number) => NumberMonad;
    add: (by: number) => NumberMonad;
    subtract: (by: number) => NumberMonad;
    multiply: (by: number) => NumberMonad;
    divide: (by: number) => NumberMonad;
    equals: (n: number) => boolean;
    defaultTo: (a: unknown) => NumberMonad;
}

export interface ObjectMonad extends Monad<object> {
    path: Function;
    prop: Function;
    defaultTo: (a: unknown) => ObjectMonad;
}

export interface SymbolMonad extends Monad<symbol> {
    defaultTo: (a: unknown) => SymbolMonad;
}

export interface BooleanMonad extends Monad<boolean> {
    defaultTo: (a: unknown) => BooleanMonad;
}

export interface ArrayMonad<T> extends Monad<T[]> {
    defaultTo: (a: unknown) => ArrayMonad<T>;
}

export interface NullMonad extends NullableMonad {
    defaultTo: (a: unknown) => NullMonad;
}

export interface UndefinedMonad extends NullableMonad {
    defaultTo: (a: unknown) => UndefinedMonad;
}

export interface NaNMonad extends NullableMonad {
    defaultTo: (a: unknown) => NaNMonad;
}

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
    [key: string]: MonasteryMonadConstructor<unknown, unknown>;
};

export type MonasteryMonadConstructor<ValueT, MonadT> = {
    of: (x: ValueT) => MonadT;
    [$$TypeReflectionSymbol]: string;
    assert: (x: unknown) => x is MonadT;
    check: (x: unknown) => x is ValueT;
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
