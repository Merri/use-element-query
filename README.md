# useMediaQuery and useElementQuery
[![Version](https://img.shields.io/npm/v/use-element-query.svg)](https://www.npmjs.com/package/use-element-query)
[![NPM-Size](https://flat.badgen.net/bundlephobia/minzip/use-element-query)](https://www.npmjs.com/package/use-element-query)
[![Build Status](https://travis-ci.org/Merri/use-element-query.svg)](https://travis-ci.org/Merri/use-element-query)

These React hooks make it easy for you to match with your media queries.

**Get it**: `npm install use-element-query --save`

## What?

Given things you want to do with your media queries...

```jsx
const queries = {
    '(max-width: 299px)': { thing: 'A' },
    '(min-width: 300px) and (max-width: 599px)': { thing: 'B' },
    '(min-width: 600px)': { thing: 'C' }
}
```

... you can ask for a list of things that match!

```jsx
function ResponsiveComponent() {
    const things = useMediaQuery(queries)
    // server side: = []
    // client side: = [{ thing: 'A' }]
    //          or: = [{ thing: 'B' }]
    //          or: = [{ thing: 'C' }]
    return (
        <div>
            Things that match:
            <pre>{JSON.stringify(things, null, 4)}</pre>
        </div>
    )
}
```

As the output is an array you can have multiple matching queries at one time. Also, you can use whatever you want as
your "thing": it can be a string, object, array, React component, CSS styles, callback function...

`useMediaQuery` works with `window.matchMedia` so you can use any query that works with it.

## What about `useElementQuery`?

This is an extension that creates `<object data="about:blank" type="text/html" />` element inside container element that
is determinted via `ref`. A `position` that is not `static` is required as the `object` element is made as large as the
container using `position: absolute`. This is a [trick from 2013 used for element resize detection](http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/).
This library however instead uses `matchMedia` of the `object` which then allows to use media queries for a viewport
that is the same size as the container element!

### Usage

```jsx
import React, { useMemo } from 'react'
import { useElementQuery } from 'use-element-query'

// define this outside component to keep the same reference
// or if you need this to be dynamic: useMemo
const queries = {
    '(max-width: 299px)': 'small',
    '(min-width: 300px) and (max-width: 599px)': 'medium',
    '(min-width: 600px)': 'large'
}

function ResponsiveComponent() {
    // third value is always an array with all matching items
    const [ref, baseStyle, [size = 'default']] = useElementQuery(queries)

    // for demo purposes set a width that is smaller than the viewport width
    const style = useMemo(() => ({ width: '50%', ...baseStyle }), [baseStyle])

    // ref and baseStyle always passed to the container
    return (
        <div ref={ref} style={style}>
            <h2>Size is <code>{size}</code></h2>
        </div>
    )
}
```

### Can `useElementQuery` be used with Styled Components?

Yes, [check out this CodeSandbox](https://codesandbox.io/s/demo-useelementquery-with-styled-components-ccy44)!

You will end up with a bit more boilerplate code than with `:container()` syntax that is used by solutions like
[Styled Container Query](https://www.npmjs.com/package/styled-container-query), but this library is much smaller yet
also supports changing your render path entirely depending on available container width; although one could argue you
should always keep the HTML/DOM the same and only change the appearance via CSS.

### Caveats

While this trick is performant there are some memory consumption issues so you should avoid using this on very many
elements at the same time. Also, `object` element is added to the DOM and this may have some effect to your CSS if you
need `:first-child` or `:last-child` on the container. The current minimalist design tries to make usage as easy as
possible and thus `object` is added without React: if this proves to be problematic it might be necessary the change the
API at some point.

Circularity issues are shared with all solutions that do container queries these days, and is the reason there are
container query libraries instead of a CSS standard.

## Motivation

I got annoyed at work how hard it was to calculate "content width" in CSS, especially with a dynamic sidebar and having
complex product lists. So originally this was a quick weekend project to get something usable that gives CSS /
`matchMedia` style of syntax via a React hook. I didn't find any other solution that would keep familiar media query
syntax, or that would allow for anything to be used as a result value from query. Also, I do not know of any other
solution that has used `matchMedia` from a `<object data="about:blank" type="text/html" />`.

Container queries and element queries have been long in the discussion, but ultimately it seems they might never be
actually implemented despite numerous proposals, polyfills, and other JavaScript based implementations.

### Alternatives for Container Queries

Minzipped sizes are as of 2019-11-28.

- [React Container Query](https://www.npmjs.com/package/react-container-query) (6,5 kB)
- [React Element Query](https://www.npmjs.com/package/react-element-query) (8,7 kB)
- [Styled Container Query](https://www.npmjs.com/package/styled-container-query) (5,6 kB)
- [ZeeCoder: React Container Query](https://www.npmjs.com/package/@zeecoder/react-container-query) (16,1 kB)

## Note about the status of the repo

I really should upgrade to latest Babel and stuff, instead of copy-pasting from old projects. Packages are a bit old.
Also, should see the trouble to learn Storybook and make use of it.
