import {
    $Array,
    $Boolean,
    $Number,
    $Object,
    $String,
    $Symbol,
    $$TypeSymbols
} from './index';
import {
    ArrayMonad,
    BooleanMonad,
    NumberMonad,
    ObjectMonad,
    StringMonad,
    SymbolMonad,
    Monad
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
