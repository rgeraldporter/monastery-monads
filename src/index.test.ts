import {
    $Array,
    $Boolean,
    $Number,
    $Object,
    $String,
    $Symbol,
    $$TypeSymbols,
    $Type,
    $Maybe,
    $Null,
    $Just,
    $Nothing
} from './index';
import {
    ArrayMonad,
    BooleanMonad,
    NumberMonad,
    ObjectMonad,
    StringMonad,
    SymbolMonad,
    Monad,
    MonasteryTypeParameters,
    MonasteryMonadTypeParameters,
    $$ReflectionSymbol,
    MonasteryTypeValue,
    MonasteryTypeConstructorTuple,
    TypeMonad,
    TypeMethods
} from './types';

describe('$Array', () => {
    it('should satisfy the first monad law of left identity', () => {
        const a = [1];
        const f = (nx: number[]): ArrayMonad<number> =>
            $Array.of(nx.map(n => n * 2));

        // 1. unit(x).chain(f) ==== f(x)
        const leftIdentity1 = $Array.of(a).chain(f);
        const leftIdentity2 = f(a);

        expect(leftIdentity1.join()).toEqual(leftIdentity2.join());
    });

    it('should satisfy the second monad law of right identity', () => {
        const a = [6, 2, 2, 4];

        // 2. m.chain(unit) ==== m
        const rightIdentity1 = $Array.of(a).chain($Array.of);
        const rightIdentity2 = $Array.of(a);

        expect(rightIdentity1.join()).toEqual(rightIdentity2.join());
    });

    it('should satisfy the third monad law of associativity', () => {
        const a = [1, 2, 2, 15, 412];
        const g = (nx: number[]): ArrayMonad<number> =>
            $Array.of(nx.map(n => n * 2));
        const f = (nx: number[]): ArrayMonad<number> =>
            $Array.of(nx.map(n => n + 102));

        // 3. m.chain(f).chain(g) ==== m.chain(x => f(x).chain(g))
        const associativity1 = $Array
            .of(a)
            .chain(g)
            .chain(f);
        const associativity2 = $Array
            .of(a)
            .chain((x: number[]) => g(x).chain(f));

        expect(associativity1.join()).toEqual(associativity2.join());
    });

    it('should have an $Array symbol', () => {
        const a = $Array.of([1]);

        expect(a.is).toBe($$TypeSymbols.prop('$Array').join());
    });
});

describe('$Number', () => {
    it('should satisfy the first monad law of left identity', () => {
        const f = (n: number): NumberMonad => $Number.of(n * 2);

        // 1. unit(x).chain(f) ==== f(x)
        const leftIdentity1 = $Number.of(1).chain(f);
        const leftIdentity2 = f(1);

        expect(leftIdentity1.join()).toEqual(leftIdentity2.join());
    });

    it('should satisfy the second monad law of right identity', () => {
        // 2. m.chain(unit) ==== m
        const rightIdentity1 = $Number.of(2).chain($Number.of);
        const rightIdentity2 = $Number.of(2);

        expect(rightIdentity1.join()).toEqual(rightIdentity2.join());
    });

    it('should satisfy the third monad law of associativity', () => {
        const g = (n: number): NumberMonad => $Number.of(n + 1);
        const f = (n: number): NumberMonad => $Number.of(n * 2);

        // 3. m.chain(f).chain(g) ==== m.chain(x => f(x).chain(g))
        const associativity1 = $Number
            .of(3)
            .chain(g)
            .chain(f);
        const associativity2 = $Number
            .of(3)
            .chain((x: number) => g(x).chain(f));

        expect(associativity1.join()).toEqual(associativity2.join());
    });

    it('should have an $Number symbol', () => {
        const a = $Number.of(12);

        expect(a.is).toBe($$TypeSymbols.prop('$Number').join());
    });

    it('should be able to do basic math', () => {
        const x = $Number
            .of(1)
            .add(10)
            .increment()
            .subtract(2)
            .decrement()
            .multiply(3)
            .divide(3);

        expect(x.join()).toEqual(9);
    });
});

describe('$Boolean', () => {
    it('should satisfy the first monad law of left identity', () => {
        const f = (x: boolean): BooleanMonad => $Boolean.of(!x);

        // 1. unit(x).chain(f) ==== f(x)
        const leftIdentity1 = $Boolean.of(false).chain(f);
        const leftIdentity2 = f(false);

        expect(leftIdentity1.join()).toEqual(leftIdentity2.join());
    });

    it('should satisfy the second monad law of right identity', () => {
        // 2. m.chain(unit) ==== m
        const rightIdentity1 = $Boolean.of(true).chain($Boolean.of);
        const rightIdentity2 = $Boolean.of(true);

        expect(rightIdentity1.join()).toEqual(rightIdentity2.join());
    });

    it('should satisfy the third monad law of associativity', () => {
        const g = (x: boolean): BooleanMonad => $Boolean.of(!x && x);
        const f = (x: boolean): BooleanMonad => $Boolean.of(x || x || x);

        // 3. m.chain(f).chain(g) ==== m.chain(x => f(x).chain(g))
        const associativity1 = $Boolean
            .of(true)
            .chain(g)
            .chain(f);
        const associativity2 = $Boolean
            .of(true)
            .chain((x: boolean) => g(x).chain(f));

        expect(associativity1.join()).toEqual(associativity2.join());
    });

    it('should have an $Boolean symbol', () => {
        const a = $Boolean.of(false);

        expect(a.is).toBe($$TypeSymbols.prop('$Boolean').join());
    });
});

describe('$Object', () => {
    it('should satisfy the first monad law of left identity', () => {
        const a = { x: 10 };
        const f = (x: {}): ObjectMonad =>
            $Object.of(Object.assign(x, { a: 2 }));

        // 1. unit(x).chain(f) ==== f(x)
        const leftIdentity1 = $Object.of(a).chain(f);
        const leftIdentity2 = f(a);

        expect(leftIdentity1.join()).toEqual(leftIdentity2.join());
    });

    it('should satisfy the second monad law of right identity', () => {
        const a = {
            b: {
                x: true
            },
            c: [1, 2, 12],
            d: false
        };

        // 2. m.chain(unit) ==== m
        const rightIdentity1 = $Object.of(a).chain($Object.of);
        const rightIdentity2 = $Object.of(a);

        expect(rightIdentity1.join()).toEqual(rightIdentity2.join());
    });

    it('should satisfy the third monad law of associativity', () => {
        const a = {
            b: {
                x: true
            },
            c: [1, 2, 12],
            d: false
        };

        const g = (x: {}): ObjectMonad =>
            $Object.of(Object.assign(x, { a: 2 }));
        const f = (x: {}): ObjectMonad =>
            $Object.of(Object.assign(x, { a: 150128, b: true }));

        // 3. m.chain(f).chain(g) ==== m.chain(x => f(x).chain(g))
        const associativity1 = $Object
            .of(a)
            .chain(g)
            .chain(f);
        const associativity2 = $Object.of(a).chain((x: {}) => g(x).chain(f));

        expect(associativity1.join()).toEqual(associativity2.join());
    });

    it('should be able to retrieve a value from a path', () => {
        const a = {
            b: {
                x: {
                    y: true
                },
                s: {
                    a: {
                        b: 12
                    }
                }
            },
            c: [1, 2, 12],
            d: false
        };

        const bx = $Object.of(a).path(['b', 'x']);
        expect(bx.join()).toEqual({ y: true });

        const c = $Object.of(a).path(['c']);
        expect(c.join()).toEqual([1, 2, 12]);

        const b = $Object.of(a).path(['b', 's', 'a', 'b']);
        expect(b.join()).toEqual(12);
    });

    it('should return a nothing type monad when the path is not present', () => {
        const a = {
            b: {
                x: {
                    y: true,
                    z: null
                }
            },
            c: [1, 2, 12],
            d: false
        };

        const bx = $Object.of(a).path(['b', 'x', 'z']);
        expect(bx.inspect()).toEqual('Nothing');
    });
});

describe('$String', () => {
    it('should satisfy the first monad law of left identity', () => {
        const f = (x: string): StringMonad => $String.of(`[${x}]`);

        // 1. unit(x).chain(f) ==== f(x)
        const leftIdentity1 = $String.of('beep').chain(f);
        const leftIdentity2 = f('beep');

        expect(leftIdentity1.join()).toEqual(leftIdentity2.join());
    });

    it('should satisfy the second monad law of right identity', () => {
        // 2. m.chain(unit) ==== m
        const rightIdentity1 = $String.of('boop').chain($String.of);
        const rightIdentity2 = $String.of('boop');

        expect(rightIdentity1.join()).toEqual(rightIdentity2.join());
    });

    it('should satisfy the third monad law of associativity', () => {
        const g = (x: string): StringMonad => $String.of(`{${x}}`);
        const f = (x: string): StringMonad => $String.of(`${x} :`);

        // 3. m.chain(f).chain(g) ==== m.chain(x => f(x).chain(g))
        const associativity1 = $String
            .of('meep')
            .chain(g)
            .chain(f);
        const associativity2 = $String
            .of('meep')
            .chain((x: string) => g(x).chain(f));

        expect(associativity1.join()).toEqual(associativity2.join());
    });

    it('should be able to append and prepend strings', () => {
        const str = $String.of('This is a sentence').append('.');
        const strPre = $String.of('this is an item on a list').prepend('1. ');

        expect(str.join()).toEqual('This is a sentence.');
        expect(strPre.join()).toEqual('1. this is an item on a list');
    });

    it('should be able to retrieve substrings', () => {
        const firstChar = $String.of('This is a sentence.').substring(0, 1);
        const is = $String.of('This is a sentence.').substring(2, 4);

        expect(firstChar.join()).toEqual('T');
        expect(is.join()).toEqual('is');
    });

    it('should be able to trim a string', () => {
        const trim = $String.of('    This is ').trim();

        expect(trim.join()).toEqual('This is');
    });
});

describe('$Symbol', () => {
    it('should satisfy the first monad law of left identity', () => {
        const $$s = Symbol();
        const f = (x: symbol): SymbolMonad => $Symbol.of(x);

        // 1. unit(x).chain(f) ==== f(x)
        const leftIdentity1 = $Symbol.of($$s).chain(f);
        const leftIdentity2 = f($$s);

        expect(leftIdentity1.join()).toEqual(leftIdentity2.join());
    });

    it('should satisfy the second monad law of right identity', () => {
        const $$s = Symbol();

        // 2. m.chain(unit) ==== m
        const rightIdentity1 = $Symbol.of($$s).chain($Symbol.of);
        const rightIdentity2 = $Symbol.of($$s);

        expect(rightIdentity1.join()).toEqual(rightIdentity2.join());
    });

    it('should satisfy the third monad law of associativity', () => {
        const $$s = Symbol();
        const g = (s: symbol): SymbolMonad => $Symbol.of(s);
        const f = (s: symbol): SymbolMonad => $Symbol.of(s);

        // 3. m.chain(f).chain(g) ==== m.chain(x => f(x).chain(g))
        const associativity1 = $Symbol
            .of($$s)
            .chain(g)
            .chain(f);
        const associativity2 = $Symbol
            .of($$s)
            .chain((s: symbol) => g(s).chain(f));

        expect(associativity1.join()).toEqual(associativity2.join());
    });
});

describe('$Maybe', () => {
    it('should be able to fork left if Nothing', () => {
        const answer = $Maybe.of(undefined).fork(() => 1, () => 0);
        expect(answer).toBe(1);
    });

    it('should be able to fork right if Just', () => {
        const answer = $Maybe.of(1).fork(() => 0, (a: number) => a);
        expect(answer).toBe(1);
    });

    it('should be able to default to a value', () => {
        const answer = $Maybe
            .of(undefined)
            // @ts-ignore
            .as($Number)
            .defaultTo(1);
        expect(answer.join()).toBe(1);
    });

    it('should be able to default to the correct type value', () => {
        const answer = $Maybe
            .of('string')
            // @ts-ignore
            .as($Number)
            .defaultTo(1);
        expect(answer.join()).toBe(1);
    });

    it('should be able to skip the default value when the provided value validates', () => {
        const answer = $Maybe
            .of('string')
            // @ts-ignore
            .as($String)
            .defaultTo('x');
        expect(answer.join()).toBe('string');
    });

    it('should be able to work with objects', () => {
        const answer = $Maybe
            .of(null)
            // @ts-ignore
            .as($Object)
            .defaultTo({ a: 1 });
        expect(answer.join()).toEqual({ a: 1 });
    });

    it('should be able to work with arrays', () => {
        const answer = $Maybe
            .of({ a: 1 })
            // @ts-ignore
            .as($Array)
            .defaultTo([{ a: 1 }]);
        expect(answer.join()).toEqual([{ a: 1 }]);
    });

    it('should be able to work with arrays', () => {
        const answer = $Maybe
            .of({ a: 1 })
            // @ts-ignore
            .as($Symbol)
            .defaultTo(Symbol('test'));
        expect(answer.inspect()).toBe('$Symbol(Symbol(test))');
    });

    it('should be able to work with boolean', () => {
        const answer = $Maybe
            .of(null)
            // @ts-ignore
            .as($Boolean)
            .defaultTo(true);
        expect(answer.join()).toBe(true);
    });

    it('should not be able to set values into $Null', () => {
        const answer = $Maybe
            .of({ a: 1 })
            // @ts-ignore
            .as($Null)
            .defaultTo({ a: 1 });
        expect(answer.inspect()).toEqual('$Null()');
    });

    it('should be able to work with objects by allowing further chaining', () => {
        const answer = $Maybe
            .of(null)
            // @ts-ignore
            .as($Object)
            .defaultTo({ a: 1 })
            .path(['a'])
            .join();
        expect(answer).toEqual(1);
    });

    it('should be able to work with strings and continue to chain', () => {
        const answer = $Maybe
            .of('my string')
            // @ts-ignore
            .as($String)
            .defaultTo('a string')
            .prepend('This is ')
            .append('.')
            .join();
        expect(answer).toBe('This is my string.');
    });

    it('should be able to set default number then chain', () => {
        const answer = $Maybe
            .of(undefined)
            // @ts-ignore
            .as($Number)
            .defaultTo(2)
            .increment()
            .subtract(2)
            .join();
        expect(answer).toBe(1);
    });

    it('should be able to set real number then chain', () => {
        const answer = $Maybe
            .of(20)
            // @ts-ignore
            .as($Number)
            .defaultTo(2)
            .increment()
            .subtract(2)
            .join();
        expect(answer).toBe(19);
    });
});

describe('$Type generated types', () => {
    it('should satisfy the first monad law of left identity', () => {
        type FirstLawValues = {
            num: NumberMonad;
            str: StringMonad;
        };

        interface FirstLawMethods extends TypeMethods {
            addNum: Function;
            concatStr: Function;
        }

        interface FirstLaw extends TypeMonad, FirstLawMethods {}

        type FirstLawConstructor = {
            of: (x: unknown) => FirstLaw;
        };

        const $FirstLaw: FirstLawConstructor = $Type.of([
            '$FirstLaw',
            { num: $Number, str: $String },
            x => ({
                addNum: (a: number) =>
                    $Number.assert(x.num) ? x.num.join() + a : a, // idea: .assert().fork(); $Maybe.as.defaultTo instead
                concatStr: (s: string) =>
                    $String.assert(x.str) ? x.str.join() + s : s
            })
        ]) as FirstLawConstructor;

        const s: FirstLawValues = {
            num: $Number.of(10),
            str: $String.of('test')
        };

        const f = (x: MonasteryMonadTypeParameters): FirstLaw =>
            $FirstLaw.of({
                num: $Number.of((x.num as NumberMonad).join() + 1),
                str: $String.of(((x.str as StringMonad).join() as string) + '.')
            });

        // 1. unit(x).chain(f) ==== f(x)
        const leftIdentity1 = $FirstLaw.of(s).chain(f);
        const leftIdentity2 = f(s);

        expect(
            (leftIdentity1.join() as MonasteryMonadTypeParameters).num.join()
            // @ts-ignore
        ).toEqual(
            // @ts-ignore
            (leftIdentity2.join() as MonasteryMonadTypeParameters).num.join()
        );
        // @ts-ignore
        expect(leftIdentity1.join().str.join()).toEqual(
            // @ts-ignore
            leftIdentity2.join().str.join()
        );

        const t = { num: 10, str: 'test' };

        const g = (x: MonasteryTypeParameters) =>
            $FirstLaw.of({ num: (x.num as number) + 1, str: x.str + '.' });

        // 1. unit(x).chain(f) ==== f(x)
        // @ts-ignore
        const leftIdentity3 = $FirstLaw.of(t).chain(g);
        // @ts-ignore
        const leftIdentity4 = g(t);

        // @ts-ignore
        expect(leftIdentity3.join().num).toEqual(leftIdentity4.join().num);
        // @ts-ignore
        expect(leftIdentity3.join().str).toEqual(leftIdentity4.join().str);
    });

    it('should satisfy the second monad law of right identity', () => {
        const $SecondLaw = $Type.of([
            '$SecondLaw',
            { num: $Number, str: $String, bool: $Boolean },
            x => ({
                addNum: (a: number) =>
                    $Number.assert(x.num) ? x.num.join() + a : a, // idea: .assert().fork()
                concatStr: (s: string) =>
                    $String.assert(x.str) ? x.str.join() + s : s,
                isTrue: () => ($Boolean.assert(x.bool) ? x.bool : false)
            })
        ]);

        const s = {
            num: $Number.of(52),
            str: $String.of('test'),
            bool: $Boolean.of(1 === 1)
        };

        // 2. m.chain(unit) ==== m
        const rightIdentity1 = $SecondLaw.of(s).chain($SecondLaw.of);
        const rightIdentity2 = $SecondLaw.of(s);

        expect(rightIdentity1.join()).toEqual(rightIdentity2.join());
    });

    it('should satisfy the third monad law of associativity', () => {
        const $ThirdLaw = $Type.of([
            '$ThirdLaw',
            { num: $Number, str: $String, bool: $Boolean, obj: $Object },
            x => ({
                addToNum: (a: number) =>
                    $Number.assert(x.num)
                        ? $ThirdLaw.of({ ...x, num: x.num.join() + a })
                        : $ThirdLaw.of({ ...x, num: a }), // idea: .assert().fork()
                concatStr: (s: string) =>
                    $String.assert(x.str)
                        ? $ThirdLaw.of({ ...x, str: x.str.join() + s })
                        : $ThirdLaw.of({ ...x, str: s }),
                isTrue: () => ($Boolean.assert(x.bool) ? x.bool : false)
            })
        ]);

        const s = {
            num: $Number.of(52),
            str: $String.of('test'),
            bool: $Boolean.of(1 === 1),
            obj: $Object.of({ a: 1 })
        };

        const g = (x: {}) => $ThirdLaw.of({ ...x, num: 15 });
        const f = (x: {}) => $ThirdLaw.of({ ...x, str: 'ijasas' });

        // 3. m.chain(f).chain(g) ==== m.chain(x => f(x).chain(g))
        const associativity1 = $ThirdLaw
            .of(s)
            .chain(g)
            .chain(f);
        const associativity2 = $ThirdLaw.of(s).chain((x: {}) => g(x).chain(f));

        expect(associativity1.join()).toEqual(associativity2.join());
    });

    it('can have methods that extend TypeMonad, assert type, and return new monads', () => {
        interface MyTypeMethods extends TypeMethods {
            addToNum: Function;
            concatStr: Function;
            isTrue: Function;
        }

        interface MyType extends TypeMonad, MyTypeMethods {}

        type MyTypeConstructor = {
            of: (x: unknown) => MyType;
        };

        const $MyType: MyTypeConstructor = $Type.of([
            '$MyType',
            { num: $Number, str: $String, bool: $Boolean, obj: $Object },
            (x): MyTypeMethods => ({
                addToNum: (a: number) =>
                    $Number.assert(x.num)
                        ? $MyType.of({ ...x, num: x.num.join() + a })
                        : $MyType.of({ ...x, num: a }), // idea: .assert().fork()
                concatStr: (s: string) =>
                    $String.assert(x.str)
                        ? $MyType.of({ ...x, str: x.str.join() + s })
                        : $MyType.of({ ...x, str: s }),
                isTrue: () => ($Boolean.assert(x.bool) ? x.bool : false)
            })
        ]) as MyTypeConstructor;

        const t: MyType = $MyType.of({
            num: $Number.of(521),
            str: $String.of('test'),
            bool: $Boolean.of(1 === 1),
            obj: $Object.of({ a: 1 })
        }) as MyType;

        expect(t.addToNum(11).join().num).toBe(532);
    });

    it('throws errors when the type being created does not match', () => {
        interface MyTypeMethods extends TypeMethods {
            addToNum: Function;
            concatStr: Function;
            isTrue: Function;
        }

        interface MyType extends TypeMonad, MyTypeMethods {}

        type MyTypeConstructor = {
            of: (x: unknown) => MyType;
        };

        const $MyType: MyTypeConstructor = $Type.of([
            '$MyType',
            { num: $Number, str: $String, bool: $Boolean, obj: $Object },
            (x): MyTypeMethods => ({
                addToNum: (a: number) =>
                    $Number.assert(x.num)
                        ? $MyType.of({ ...x, num: x.num.join() + a })
                        : $MyType.of({ ...x, num: a }), // idea: .assert().fork()
                concatStr: (s: string) =>
                    $String.assert(x.str)
                        ? $MyType.of({ ...x, str: x.str.join() + s })
                        : $MyType.of({ ...x, str: s }),
                isTrue: () => ($Boolean.assert(x.bool) ? x.bool : false)
            })
        ]) as MyTypeConstructor;

        expect($MyType.of).toThrow('Constructor must be an object.');

        const myT = (): MyType =>
            $MyType.of({
                num: $Number.of(521),
                str: $String.of('test'),
                bool: $Boolean.of(1 === 1),
                obj: $Object.of({ a: 1 }),
                thing: $String.of('this aint right')
            }) as MyType;

        expect(myT).toThrow(TypeError);
    });

    it('throws errors when the wrong type goes into a type', () => {
        interface MyTypeMethods extends TypeMethods {
            addToNum: Function;
            concatStr: Function;
            isTrue: Function;
        }

        interface MyType extends TypeMonad, MyTypeMethods {}

        type MyTypeConstructor = {
            of: (x: unknown) => MyType;
        };

        const $MyType: MyTypeConstructor = $Type.of([
            '$MyType',
            { num: $Number, str: $String, bool: $Boolean, obj: $Object },
            (x): MyTypeMethods => ({
                addToNum: (a: number) =>
                    $Number.assert(x.num)
                        ? $MyType.of({ ...x, num: x.num.join() + a })
                        : $MyType.of({ ...x, num: a }), // idea: .assert().fork()
                concatStr: (s: string) =>
                    $String.assert(x.str)
                        ? $MyType.of({ ...x, str: x.str.join() + s })
                        : $MyType.of({ ...x, str: s }),
                isTrue: () => ($Boolean.assert(x.bool) ? x.bool : false)
            })
        ]) as MyTypeConstructor;

        const myT = (): MyType =>
            $MyType.of({
                num: $Number.of(521),
                str: $String.of('test'),
                bool: $Boolean.of(1 === 1),
                obj: $String.of('this aint it')
            }) as MyType;

        expect(myT).toThrow(TypeError);
    });
});

describe('README examples', () => {
    it('should convert temperatures', () => {
        const thermometerReadingF = 12;
        const fahrenheitToCelsius = ($n: NumberMonad) =>
            $n.subtract(32).multiply(0.5556);
        const fahrenheitToKelvin = ($n: NumberMonad) =>
            fahrenheitToCelsius($n).add(273.15);
        const fahrenheitToRankine = ($n: NumberMonad) => $n.add(459.67);

        const temperature = $Number.of(thermometerReadingF);

        const celsius = fahrenheitToCelsius(temperature).emit();
        const kelvin = fahrenheitToKelvin(temperature).emit();
        const rankine = fahrenheitToRankine(temperature).emit();

        expect(celsius.toFixed(1)).toBe('-11.1');
        expect(kelvin.toFixed(1)).toBe('262.0');
        expect(rankine.toFixed(1)).toBe('471.7');
    });

    it('should do the example log string correctly', () => {
        const logString = 'Value was over the threshold ';
        const tag = 'log';

        const formatForConsole = ($str: StringMonad) =>
            $str.prepend(`[${tag}] `);
        const formatForDb = ($str: StringMonad) => $str.trim();

        const logEntry = $String.of(logString);
        const logConsole = formatForConsole(logEntry).emit();
        const logDb = formatForDb(logEntry).emit();

        expect(logConsole).toBe('[log] Value was over the threshold ');
        expect(logDb).toBe('Value was over the threshold');
    });

    it('handle the string example', () => {
        const status1 = null;
        const status2 = 'Away';
        const statusText = ($str: unknown) =>
            $Maybe
                .of($str)
                // @ts-ignore
                .as($String)
                .defaultTo('None');

        // Extend further with $String
        const logStatusText = statusText(status2).prepend(`[user-status] `);

        expect(statusText(status1).emit()).toBe('None');
        expect(statusText(status2).emit()).toBe('Away');
        expect(logStatusText.emit()).toBe('[user-status] Away');
    });
});
