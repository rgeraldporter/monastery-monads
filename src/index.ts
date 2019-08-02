import {
    JustMonad,
    MaybeMonad,
    StringMonad,
    NumberMonad,
    SymbolMonad,
    ArrayMonad,
    ObjectMonad,
    BooleanMonad,
    NullMonad,
    UndefinedMonad,
    NaNMonad,
    Monad,
    MonasteryTypeValue,
    MonasteryMonadConstructor,
    MonasteryMonadMethodsFunction,
    MonasteryMonadPropsConstructor,
    TypeMethods,
    MonasteryMonadTypePropertyValuesIntersection,
    MonasteryTypeConstructorTuple,
    MonasteryMonadTypeParameters,
    MonasteryTypeParameters,
    TypeMonad,
    CreateTypeValue,
    $$TypeReflectionSymbol,
    $$MonasteryMonadSymbol,
    $$MonasteryTypeMonadSymbol,
    NaNType,
    PrimativeMonad,
    NothingMonad
} from './types';

const _monasteryTypeSymbol = (t: string): symbol =>
    Symbol(`MonasteryMonad::${t}`);

const $$TypeSymbols: { [key: string]: symbol } = {
    $String: _monasteryTypeSymbol('$String'),
    $Number: _monasteryTypeSymbol('$Number'),
    $Symbol: _monasteryTypeSymbol('$Symbol'),
    $Array: _monasteryTypeSymbol('$Array'),
    $Object: _monasteryTypeSymbol('$Object'),
    $Boolean: _monasteryTypeSymbol('$Boolean'),
    $Null: _monasteryTypeSymbol('$Null'),
    $Undefined: _monasteryTypeSymbol('$Undefined'),
    $NaN: _monasteryTypeSymbol('$NaN'),
    $Maybe: _monasteryTypeSymbol('$Maybe'),
    $Nothing: _monasteryTypeSymbol('$Nothing'),
    $Just: _monasteryTypeSymbol('$Just'),
    $Type: _monasteryTypeSymbol('$Type'),
    $Proto$Type$: _monasteryTypeSymbol('$Proto$Type$')
};

const $Just = <ValueT>(x: ValueT): JustMonad => ({
    map: (f) => $Maybe.of(f(x)),
    chain: <U>(f: Function): U => f(x),
    inspect: (): string => `$Just(${x})`,
    join: (): ValueT => x,
    emit: (): ValueT => x,
    unwrap: (): ValueT => x,
    fork: (_: Function, f: Function) => f(x),
    // takes a constructor, if check passes, makes it that type, if not, passes type back as Just(TypeConstructor())
    // @ts-ignore can't seem to get it to understand the check is JustMonad | MonadT3; leads to errors in checking that shouldn't be
    as: <ValueT2, MonadT2>(a: MonasteryMonadConstructor<ValueT2, MonadT2>) => (a.check(x) ? a.of(x) : $Just(a)),
    defaultTo: <ValueT3, MonadT3>(y: ValueT3): MonadT3 => (x as unknown as MonasteryMonadConstructor<ValueT3, MonadT3>).of(y) as MonadT3,
    /*(x as unknown as MonasteryMonadConstructor<unknown, unknown>)[$$TypeReflectionSymbol]
            && (x as unknown as MonasteryMonadConstructor<unknown, unknown>).of
        ? (x as unknown as MonasteryMonadConstructor<unknown, unknown>).of(y)
        : x as never, // should never reach here, unless bad constructor was passed. @todo, add error
    */
    is: $$TypeSymbols.$Just,
    [$$MonasteryMonadSymbol]: true
});

const $Nothing = (): NothingMonad => ({
    inspect: () => `Nothing`,
    map: _ => $Nothing(),
    chain: _ => $Nothing(),
    join: () => $Nothing(),
    emit: () => $Nothing(),
    unwrap: () => $Nothing(),
    fork: (f: Function, _: Function) => f(),
    // Maybe this type is why the error below
    // @ts-ignore can't seem to get it to understand the check is JustMonad | MonadT3; leads to errors in checking that shouldn't be
    as: <ValueT2, MonadT2>(a: MonasteryMonadConstructor<ValueT2, MonadT2>) => $Just(a),
    defaultTo: () => $Nothing(),
    is: $$TypeSymbols.$Nothing,
    [$$MonasteryMonadSymbol]: true
});

const $Maybe = {
    of: (x: unknown): MaybeMonad =>
        x === null ||
            x === undefined ||
            (x as NothingMonad).is === $$TypeSymbols.$Nothing
            ? $Nothing()
            : $Just(x)
};

const $String = (x: string): StringMonad => ({
    map: (f: Function): StringMonad => $String(f(x)),
    chain: <T>(f: Function): T => f(x),
    inspect: (): string => `$String(${x})`,
    join: (): string => x,
    emit: (): string => x,
    unwrap: (): string => x,
    prepend: (s: string): StringMonad => $String(`${s}${x}`),
    append: (s: string): StringMonad => $String(`${x}${s}`),
    substring: (i: number, j?: number): StringMonad =>
        // so x.substring does weird things when i > j; do we want to fix that? Or be consistent with method?
        $String(x.substring(i, j || Infinity)),
    trim: (): StringMonad => $String(x.trim()),
    defaultTo: <U>(_: U) => $String(x),
    is: $$TypeSymbols.$String,
    [$$MonasteryMonadSymbol]: true
});

const $Number = (x: number): NumberMonad => ({
    map: (f: Function): NumberMonad => $Number(f(x)),
    chain: <T>(f: Function): T => f(x),
    inspect: (): string => `$Number(${x})`,
    join: (): number => x,
    emit: (): number => x,
    unwrap: (): number => x,
    increment: (n = 1): NumberMonad => $Number(x + n),
    decrement: (n = 1): NumberMonad => $Number(x - n),
    add: (n: number): NumberMonad => $Number(x + n),
    subtract: (n: number): NumberMonad => $Number(x - n),
    multiply: (n: number): NumberMonad => $Number(x * n),
    divide: (n: number): NumberMonad =>
        n === 0 ? $Number(Infinity) : $Number(x / n),
    equals: (n: number): boolean => n === x,
    defaultTo: <U>(_: U) => $Number(x),
    is: $$TypeSymbols.$Number,
    [$$MonasteryMonadSymbol]: true
});

const $Symbol = (x: symbol = Symbol()): SymbolMonad => ({
    map: (f: Function): SymbolMonad => $Symbol(f(x)),
    chain: <T>(f: Function): T => f(x),
    inspect: (): string => `$Symbol(${String(x)})`,
    join: (): symbol => x,
    emit: (): symbol => x,
    unwrap: (): symbol => x,
    defaultTo: <U>(_: U) => $Symbol(x),
    is: $$TypeSymbols.$Symbol,
    [$$MonasteryMonadSymbol]: true
});

const $Array = <T>(x: T[]): ArrayMonad<T> => ({
    map: (f: Function): ArrayMonad<T> => $Array(f(x)),
    chain: <U>(f: Function): U => f(x),
    inspect: (): string => `$Array(${x})`,
    join: (): T[] => x,
    emit: (): T[] => x,
    unwrap: (): T[] => x,
    defaultTo: <U>(_: U) => $Array(x),
    is: $$TypeSymbols.$Array,
    [$$MonasteryMonadSymbol]: true
});

const $ObjectDeepValue = (a: {}, p: string[]): MaybeMonad =>
    p.reduce(
        (acc, curKey) =>
            acc.map((x: {}) => x[curKey as keyof {}]) as MaybeMonad,
        $Maybe.of(a)
    );

const $ObjectPropValue = (a: {}, p: string): MaybeMonad =>
    $Maybe.of(a[p as keyof {}]);

const $Object = (x: {}): ObjectMonad => ({
    map: (f: Function): ObjectMonad => $Object(f(x)),
    chain: <T>(f: Function): T => f(x),
    inspect: (): string => `$Object(${x})`,
    join: (): {} => x,
    emit: (): {} => x,
    unwrap: (): {} => x,
    path: (p: string[]): {} => $ObjectDeepValue(x, p),
    prop: (p: string): {} => $ObjectPropValue(x, p),
    defaultTo: <UnusedT>(_: UnusedT): ObjectMonad => $Object(x), // no-op
    is: $$TypeSymbols.$Object,
    [$$MonasteryMonadSymbol]: true
});

const $Boolean = (x: boolean): BooleanMonad => ({
    map: (f: Function): BooleanMonad => $Boolean(f(x)),
    chain: <T>(f: Function): T => f(x),
    inspect: (): string => `$String(${x})`,
    join: (): boolean => x,
    emit: (): boolean => x,
    unwrap: (): boolean => x,
    defaultTo: <U>(_: U) => $Boolean(x),
    is: $$TypeSymbols.$Boolean,
    [$$MonasteryMonadSymbol]: true
});

const $Null = (): NullMonad => ({
    map: (f: Function): NullMonad => $Null(),
    chain: <T>(f: Function): NullMonad => $Null(),
    inspect: (): string => `$Null()`,
    join: (): NullMonad => $Null(),
    emit: (): NullMonad => $Null(),
    unwrap: (): NullMonad => $Null(),
    defaultTo: <U>(_: U) => $Null(),
    is: $$TypeSymbols.$Null,
    [$$MonasteryMonadSymbol]: true
});

const $Undefined = (): UndefinedMonad => ({
    map: (f: Function): UndefinedMonad => $Undefined(),
    chain: <T>(f: Function): UndefinedMonad => $Undefined(),
    inspect: (): string => `$Undefined()`,
    join: (): UndefinedMonad => $Undefined(),
    emit: (): UndefinedMonad => $Undefined(),
    unwrap: (): UndefinedMonad => $Undefined(),
    defaultTo: <U>(_: U) => $Undefined(),
    is: $$TypeSymbols.$Undefined,
    [$$MonasteryMonadSymbol]: true
});

const $NaN = (): NaNMonad => ({
    map: (f: Function): NaNMonad => $NaN(),
    chain: <T>(f: Function): NaNMonad => $NaN(),
    inspect: (): string => `$NaN()`,
    join: (): NaNMonad => $NaN(),
    emit: (): NaNMonad => $NaN(),
    unwrap: (): NaNMonad => $NaN(),
    defaultTo: <U>(_: U) => $NaN(),
    is: $$TypeSymbols.$NaN,
    [$$MonasteryMonadSymbol]: true
});

const $Proto$Type$ = (x: MonasteryMonadPropsConstructor): TypeMonad => ({
    map: (f: Function): TypeMonad => $Proto$Type$(f(x)),
    chain: <T>(f: Function): T => f(x),
    inspect: (): string => `$Proto$Type$(${x})`,
    join: (): MonasteryMonadPropsConstructor => x,
    emit: (): MonasteryMonadPropsConstructor => x,
    unwrap: (): MonasteryMonadPropsConstructor => x,
    defaultTo: <U>(_: U) => $Proto$Type$(x),
    is: $$TypeSymbols.$Proto$Type$,
    [$$MonasteryMonadSymbol]: true,
    [$$MonasteryTypeMonadSymbol]: true,
    extend: <U extends TypeMonad>(a: Function): U => ({
        ...$Proto$Type$(x),
        ...a(x)
    })
});

const $Proto$Type = {
    of: (x: MonasteryMonadPropsConstructor): TypeMonad => $Proto$Type$(x)
};

const $CreateTypeMonad = ({ props, name, methods }: CreateTypeValue) => {
    // stage A: extend with provided methods
    const myMonadA = (aprops: MonasteryMonadPropsConstructor) =>
        $Proto$Type.of(aprops).extend((x: MonasteryMonadPropsConstructor) => ({
            extend: (a: Function) => ({ ...myMonadA(x), ...a(x) }),
            ...methods(x)
        }));

    // stage B: supercede prototype methods save for map
    const myMonadB = (bprops: MonasteryMonadPropsConstructor) =>
        myMonadA(bprops).extend((x: MonasteryMonadPropsConstructor) => ({
            inspect: () => `${name}(${x})`,
            is: _monasteryTypeSymbol(`$Type::${name}`), // how to return to type constructor to preserve for comparison???
            extend: (a: Function) => ({ ...myMonadB(x), ...a(x) })
        }));

    // stage C: superced map to adhere to monad laws
    const myMonadC = (cprops: MonasteryMonadPropsConstructor) =>
        myMonadB(cprops).extend((x: MonasteryMonadPropsConstructor) => ({
            map: (f: Function) => myMonadC(f(x)),
            extend: (a: Function) => ({ ...myMonadC(x), ...a(x) })
        }));

    // this looks backwards but operates A -> B -> C
    return myMonadC(props);
};

const assertValueType = (
    expectedType: MonasteryMonadConstructor<unknown, unknown>,
    value: unknown
) => {
    const isMonasteryMonad = (value as Monad<unknown>)[$$MonasteryMonadSymbol];
    const isCorrectMonadType = expectedType.assert(value);
    const isWrongMonadType = isMonasteryMonad && !isCorrectMonadType;

    if (isCorrectMonadType) return true;

    if (!expectedType.check(value)) {
        throw new TypeError(
            `Wrong type! ${
            expectedType[$$TypeReflectionSymbol]
            } was expected, got ${value}`
        );
    } else if (isWrongMonadType) {
        throw new TypeError(
            `Wrong type! ${
            expectedType[$$TypeReflectionSymbol]
            } was expected, got ${value}`
        );
    } else {
        // false because while valid it is not the monad already
        return false;
    }
};

const validatePropType = (
    expectedType: MonasteryMonadConstructor<unknown, unknown>,
    value: unknown
) => {
    return (
        $$TypeSymbols[expectedType[$$TypeReflectionSymbol]] &&
        assertValueType(expectedType, value)
    );
};

const $CreateType$ = ({ methods, name, props }: CreateTypeValue) => ({
    of: (x: unknown) => {
        if (typeof x !== 'object') {
            throw new Error('Constructor must be an object.');
        }
        Object.keys(x as {}).forEach((key: string) => {
            if (!props[key]) throw new TypeError('Unknown type!');
        });
        const startingProps = Object.keys(props).reduce(
            (acc: {}, curKey: string) => ({
                ...acc,
                [curKey]: validatePropType(
                    props[curKey],
                    (x as {})[curKey as keyof {}]
                ) // @todo validate correct type
                    ? (x as MonasteryMonadTypeParameters)[curKey]
                    // @ts-ignore
                    : props[curKey]
                        .of(
                            (x as MonasteryMonadTypePropertyValuesIntersection)[
                            curKey
                            ]
                        )
                        .join()
            }),
            {}
        );
        return $CreateTypeMonad({ props: startingProps, name, methods });
    },
    [$$TypeReflectionSymbol]: name
    // @todo check, assert
});

const $Type = {
    of: (val: MonasteryTypeConstructorTuple) => {
        const [name, props, methods = () => ({})] = val;
        const $NewType = $CreateType$({ methods, name, props });
        return {
            of: (x: unknown) => $NewType.of(x)
        };
    },
    [$$TypeReflectionSymbol]: '$Type',
    assert: (x: unknown): x is TypeMonad =>
        Boolean((x as TypeMonad)[$$MonasteryTypeMonadSymbol]),
    check: (x: unknown): x is MonasteryTypeConstructorTuple =>
        typeof (x as MonasteryTypeConstructorTuple)[0] === 'string' &&
        typeof (x as MonasteryTypeConstructorTuple)[1] === 'object' &&
        (typeof (x as MonasteryTypeConstructorTuple)[2] === 'undefined' ||
            typeof (x as MonasteryTypeConstructorTuple)[2] === 'function')
};

const $StringOf = (x: string): StringMonad => $String(String(x)); // fix String(undefined) String(NaN) String(null)?
const $NumberOf = (x: number): NumberMonad => $Number(Number(x));
const $SymbolOf = (x: symbol): SymbolMonad =>
    typeof x === 'symbol' ? $Symbol(x) : $Symbol();
const $ArrayOf = <T>(x: T[]): ArrayMonad<T> =>
    Array.isArray(x) ? $Array(x as T[]) : $Array([x as T]);
const $ObjectOf = (x: {}): ObjectMonad =>
    x === Object(x) ? $Object(x) : $Object(Object(x));
const $BooleanOf = (x: boolean): BooleanMonad => $Boolean(Boolean(x));
const $NullOf = (): NullMonad => $Null();
const $UndefinedOf = (): UndefinedMonad => $Undefined();
const $NaNOf = (): NaNMonad => $NaN();

const AssertType = (x: unknown, t: string): boolean =>
    typeof x === 'object' && typeof (x as PrimativeMonad)['is'] === 'symbol'
        ? (x as PrimativeMonad)['is'] === $$TypeSymbols[t]
        : false;

/*interface Primative

interface ProtoTypeMonad {
    of: () => Monad<unknown>;
    [$$TypeReflectionSymbol]: string;
    assert: (x: unknown) => boolean;
    check: (x: unknown) => boolean;
}*/

const export$Number: MonasteryMonadConstructor<number, NumberMonad> = {
    of: $NumberOf,
    [$$TypeReflectionSymbol]: '$Number',
    assert: (x: unknown): x is NumberMonad => AssertType(x, '$Number'),
    check: (x: unknown): x is number =>
        // ts does not like parseFloat!
        // tslint:disable-next-line
        !isNaN(parseFloat(x as string)) && isFinite(x as number)
};

const export$String: MonasteryMonadConstructor<string, StringMonad> = {
    of: $StringOf,
    [$$TypeReflectionSymbol]: '$String',
    assert: (x: unknown): x is StringMonad => AssertType(x, '$String'),
    check: (x: unknown): x is string =>
        Object.prototype.toString.call(x) === '[object String]'
};

const export$Symbol: MonasteryMonadConstructor<symbol, SymbolMonad> = {
    of: $SymbolOf,
    [$$TypeReflectionSymbol]: '$Symbol',
    assert: (x: unknown): x is SymbolMonad => AssertType(x, '$Symbol'),
    check: (x: unknown): x is symbol => typeof x === 'symbol'
};

const export$Array: MonasteryMonadConstructor<Array<unknown>, ArrayMonad<unknown>> = {
    of: $ArrayOf,
    [$$TypeReflectionSymbol]: '$Array',
    assert: <T>(x: unknown): x is ArrayMonad<T> => AssertType(x, '$Array'),
    check: <U>(x: unknown): x is U[] => (x as U[]).constructor === Array
};

const export$Object: MonasteryMonadConstructor<{}, ObjectMonad> = {
    of: $ObjectOf,
    [$$TypeReflectionSymbol]: '$Object',
    assert: (x: unknown): x is ObjectMonad => AssertType(x, '$Object'),
    check: (x: unknown): x is {} => typeof x === 'object'
};

const export$Boolean: MonasteryMonadConstructor<boolean, BooleanMonad> = {
    of: $BooleanOf,
    [$$TypeReflectionSymbol]: '$Boolean',
    assert: (x: unknown): x is BooleanMonad => AssertType(x, '$Boolean'),
    check: (x: unknown): x is boolean => typeof x === 'boolean'
};

const export$Null: MonasteryMonadConstructor<null, NullMonad> = {
    of: $NullOf,
    [$$TypeReflectionSymbol]: '$Null',
    assert: (x: unknown): x is NullMonad => AssertType(x, '$Null'),
    check: (x: unknown): x is null => x === null
};

const export$Undefined: MonasteryMonadConstructor<undefined, UndefinedMonad> = {
    of: $UndefinedOf,
    [$$TypeReflectionSymbol]: '$Undefined',
    assert: (x: unknown): x is UndefinedMonad => AssertType(x, '$Undefined'),
    check: (x: unknown): x is undefined => x === undefined
};

const export$NaN: MonasteryMonadConstructor<number, NaNMonad> = {
    of: $NaNOf,
    [$$TypeReflectionSymbol]: '$NaN',
    assert: (x: unknown): x is NaNMonad => AssertType(x, '$NaN'),
    check: (x: unknown): x is NaNType => isNaN(x as number)
};

const export$Type = $Type;

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
    export$Type as $Type,
    export$$TypeSymbols as $$TypeSymbols,
    $Maybe,
    $Just,
    $Nothing,
    $$TypeReflectionSymbol
};
