# useElementQuery
[![Version](https://img.shields.io/npm/v/use-element-query.svg)](https://www.npmjs.com/package/use-element-query)
[![Build Status](https://travis-ci.org/Merri/use-element-query.svg)](https://travis-ci.org/Merri/use-element-query)

This is a React hook that provides support for element queries (or container queries). Syntax is just like CSS or `window.matchMedia`.

## Get it

```
npm install use-element-query
```

## Usage

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

function YourResponsiveComponent() {
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

### Queries object

The queries takes media queries as keys, while their value can be anything you want. Each query that actively matches is outputted in
the third output parameter.

### Container element

The container element should be a non-staticly positioned element. `position: relative` is automatically added (via `baseStyle`) if
element's computed style is detected to be `position: static`. This is required as a child `object` element is added to the container.

## Motivation

Element queries / container queries have been around as an idea for a while. This was a quick weekend project to get something usable
that gives CSS / matchMedia style of syntax via a React hook.

All current solutions I could find used ResizeObserver and/or the same object hack that this solution uses, but none used the familiar
CSS matching syntax. Also, other solutions define their queries as value and not as the key. And finally, this solution is only a hook
and does not have dependencies.
