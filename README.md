# ️️️️⛪️️ Monastery ⛪️

## Safe Monadic Types for Javascript (and TypeScript)

NOTE: This is in early stages. Don't use this yet unless you'd really like to help testing it.

## Premise

This module allows you to create a monad of any of the primatives (plus Array and a Maybe type), or build your own. This can allow you to build truly immutable values (including `Object` and `Array`) and comes runtime type enforcement without adding a type system such as TypeScript or Flow.

This is very experimental! When this has proven usable it will be promoted version 1.x.

## Documentation

Put simply there are three types of monads in here: Primatives, Maybe, and custom Types.

_This is a work in progress, more documentation is forthcoming._

### Primative Monads

Each primative is the name of the Javascript primative (and some other things), prepended with `$`:

-   `$Number`
-   `$String`
-   `$Boolean`
-   `$Array`
-   `$Object`
-   `$Symbol`
-   `$Null`
-   `$NaN`
-   `$Undefined`

#### `$Number`

```js
const thermometerReadingF = 12; // source data is in Fahrenheit
const fahrenheitToCelsius = $n => $n.subtract(32).multiply(0.5556);
const fahrenheitToKelvin = $n => fahrenheitToCelsius($n).add(273.15);
const fahrenheitToRankine = $n => $n.add(459.67);

const temperature = $Number.of(thermometerReadingF);

const celsius = fahrenheitToCelsius(temperature).emit();
const kelvin = fahrenheitToKelvin(temperature).emit();
const rankine = fahrenheitToRankine(temperature).emit();

// Note: .toFixed(1) converts to string
// > "-11.1"
console.log(celsius.toFixed(1));

// > "262.0"
console.log(kelvin.toFixed(1));

// > "471.7"
console.log(rankine.toFixed(1));
```

#### `$String`

```js
const logString = 'Value was over the threshold ';
const tag = 'log';

const formatForConsole = $str => $str.prepend(`[${tag}] `);
const formatForDb = $str => $str.trim();

const logEntry = $String.of(logString);
const logConsole = formatForConsole(logEntry).emit();
const logDb = formatForDb(logEntry).emit();

// > "[log] Value was over the threshold "
console.log(logConsole);

// > "Value was over the threshold"
console.log(logDb);
```

## Maybe Monad

### `$Maybe`

This is a typical `Maybe` monad with some extra capabilities to enforce type. Generally a `Maybe` involves checking when a value "may be something or may be nothing", in this implementation it also can be interpreted that a value "may be of a certain type".

```js
const status1 = null;
const status2 = 'Away';
const statusText = $str =>
    $Maybe
        .of($str)
        .as($String)
        .defaultTo('None');

// > "None"
console.log(statusText(status1).emit());

// > "Away"
console.log(statusText(status2).emit());

// Extend further with $String
const logStatusText = statusText(status2).prepend(`[user-status] `);

// > "[user-status] Away"
console.log(logStatusText.emit());
```

## Development

Source is written in TypeScript. Run tests via `npm run test`.

## MIT License

Copyright 2019 Robert Gerald Porter <mailto:rob@weeverapps.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
