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
    $$ReflectionSymbol,
    NaNType,
    PrimativeMonad
} from './types';

import { Maybe } from 'simple-maybe';

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
    $Type: _monasteryTypeSymbol('$Type'),
    $Proto$Type$: _monasteryTypeSymbol('$Proto$Type$')
};

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
    equals: (n: number): boolean => n === x,
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

const $Proto$Type$ = (x: MonasteryMonadPropsConstructor): TypeMonad => ({
    map: (f: Function): TypeMonad => $Proto$Type$(f(x)),
    chain: <T>(f: Function): T => f(x),
    inspect: (): string => `$Proto$Type$(${x})`,
    join: (): MonasteryMonadPropsConstructor => x,
    is: $$TypeSymbols.$Proto$Type$,
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
    expectedType: MonasteryMonadConstructor,
    value: unknown
) => {
    if (expectedType.assert(value)) return true;

    if (!expectedType.check(value)) {
         throw new TypeError('Wrong type!');
    } else {
        // false because while valid it is not the monad already
        return false;
    }
};

const validatePropType = (
    expectedType: MonasteryMonadConstructor,
    value: unknown
) =>
    $$TypeSymbols[expectedType[$$ReflectionSymbol]];

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
                    : props[curKey].of(
                          (x as MonasteryMonadTypePropertyValuesIntersection)[
                              curKey
                          ]
                      )
            }),
            {}
        );
        return $CreateTypeMonad({ props: startingProps, name, methods });
    },
    [$$ReflectionSymbol]: name
});

const $Type = {
    of: (val: MonasteryTypeConstructorTuple) => {
        const [name, props, methods = () => ({})] = val;
        const $NewType = $CreateType$({ methods, name, props });
        return {
            of: (x: unknown) => $NewType.of(x)
        };
    },
    [$$ReflectionSymbol]: '$Type'
};

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

const AssertType = (x: unknown, t: string): boolean =>
    typeof x === 'object' && typeof (x as PrimativeMonad)['is'] === 'symbol'
        ? (x as PrimativeMonad)['is'] === $$TypeSymbols[t]
        : false;

const export$Number: MonasteryMonadConstructor = {
    of: $NumberOf,
    [$$ReflectionSymbol]: '$Number',
    assert: (x: unknown): x is NumberMonad => AssertType(x, '$Number'),
    // tslint:disable-next-line
    check: (x: unknown): x is number => !isNaN(parseFloat(x as string)) && isFinite(x as number)
};

const export$String: MonasteryMonadConstructor = {
    of: $StringOf,
    [$$ReflectionSymbol]: '$String',
    assert: (x: unknown): x is StringMonad => AssertType(x, '$String'),
    check: (x: unknown): x is string => Object.prototype.toString.call(x) === '[object String]'
};

const export$Symbol: MonasteryMonadConstructor = {
    of: $SymbolOf,
    [$$ReflectionSymbol]: '$Symbol',
    assert: (x: unknown): x is SymbolMonad => AssertType(x, '$Symbol'),
    check: (x: unknown): x is symbol => typeof x === 'symbol'
};

const export$Array: MonasteryMonadConstructor = {
    // @ts-ignore need to figure out something for Arrays!
    of: $ArrayOf,
    [$$ReflectionSymbol]: '$Array',
    assert: <T>(x: unknown): x is ArrayMonad<T> => AssertType(x, '$Array'),
    check: <U>(x: unknown): x is U[] => (x as U[]).constructor === Array
};

const export$Object: MonasteryMonadConstructor = {
    of: $ObjectOf,
    [$$ReflectionSymbol]: '$Object',
    assert: (x: unknown): x is ObjectMonad => AssertType(x, '$Object'),
    check: (x: unknown): x is {} => typeof x === 'object'
 };

const export$Boolean: MonasteryMonadConstructor = {
    of: $BooleanOf,
    [$$ReflectionSymbol]: '$Boolean',
    assert: (x: unknown): x is BooleanMonad => AssertType(x, '$Boolean'),
    check: (x: unknown): x is boolean => typeof x === 'boolean'
};

const export$Null: MonasteryMonadConstructor = {
    of: $NullOf,
    [$$ReflectionSymbol]: '$Null',
    assert: (x: unknown): x is NullMonad => AssertType(x, '$Null'),
    check: (x: unknown): x is null => x === null
};

const export$Undefined: MonasteryMonadConstructor = {
    of: $UndefinedOf,
    [$$ReflectionSymbol]: '$Undefined',
    assert: (x: unknown): x is UndefinedMonad => AssertType(x, '$Undefined'),
    check: (x: unknown): x is undefined => x === undefined
};

const export$NaN: MonasteryMonadConstructor = {
    of: $NaNOf,
    [$$ReflectionSymbol]: '$NaN',
    assert: (x: unknown): x is NaNMonad => AssertType(x, '$NaN'),
    check: (x: unknown): x is NaNType => isNaN(x as number)
};

const export$Type = $Type;

// @ts-ignore
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
    $$ReflectionSymbol
};
