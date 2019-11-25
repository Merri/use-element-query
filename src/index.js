// yet another variant of http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/
import { useCallback, useEffect, useMemo, useState } from 'react'

const isIE = 'navigator' in global && navigator.userAgent.match(/Trident/)

const registry = new WeakMap()
let objectStyle = 'document' in global && document.getElementById('object-data-about-blank')

function init() {
    if (objectStyle) return
    objectStyle = document.createElement('style')
    objectStyle.id = 'object-data-about-blank'
    objectStyle.textContent = `
object[data="about:blank"] {
    clip: rect(0 0 0 0);
    height: 100%;
    left: 0;
    pointer-events: none;
    position: absolute;
    top: 0;
    user-select: none;
    width: 100%;
}
`
    document.head.appendChild(objectStyle)
}

function createObject(element, setElement) {
    const object = document.createElement('object')
    object.setAttribute('aria-hidden', 'true')
    object.onload = function() {
        const object = this
        function complete() {
            if (!object.contentDocument) setTimeout(complete, 50)
            else setElement(object.contentDocument.defaultView)
        }
        complete()
    }
    object.tabIndex = -1
    object.type = 'text/html'
    if (!isIE) object.data = 'about:blank'
    element.appendChild(object)
    if (isIE) object.data = 'about:blank'
}

const staticToRelativeOverride = {
    bottom: 0,
    left: 0,
    position: 'relative',
    right: 0,
    top: 0,
}

function initContainer(element, setElement, setStyle) {
    const style = getComputedStyle(element)
    let destroyed = false
    let styleApplied = false
    function applyStyle() {
        if (styleApplied || style.position === '') return
        if (style.position === 'static') setStyle(staticToRelativeOverride)
        styleApplied = true
    }
    applyStyle()
    createObject(element, viewElement => {
        if (destroyed) return
        applyStyle()
        if (viewElement) setElement(viewElement)
    })
    return () => {
        setElement(null)
        setStyle(null)
        destroyed = true
    }
}

export function useElementQuery(queries = {}) {
    const [ref, setRef] = useState(null)
    const [element, setElement] = useState(null)
    const [style, setStyle] = useState(null)
    const [activeItems, setActiveItems] = useState([])
    const queryKeys = useMemo(() => Object.keys(queries), [queries])

    const elementQueries = useMemo(
        () => (element && 'matchMedia' in element ? queryKeys.map(query => element.matchMedia(query)) : []),
        [element, queryKeys]
    )

    const getRef = useCallback(
        nextRef => {
            init()
            if (ref === nextRef) return
            if (registry.has(ref)) registry.get(ref)()
            if (nextRef) {
                registry.set(nextRef, initContainer(nextRef, setElement, setStyle))
            }
            setRef(nextRef)
        },
        [ref]
    )

    const updateQueries = useCallback(() => {
        const nextActiveItems = elementQueries.reduce((nextActiveItems, query, index) => {
            if (query.matches) nextActiveItems.push(queries[queryKeys[index]])
            return nextActiveItems
        }, [])
        if (
            nextActiveItems.length !== activeItems.length ||
            nextActiveItems.some((activeItem, index) => activeItems[index] !== activeItem)
        ) {
            setActiveItems(nextActiveItems)
        }
    }, [activeItems, elementQueries, queries, queryKeys])

    useEffect(() => {
        if (elementQueries.length === 0) return
        updateQueries()
        elementQueries.forEach(elementQuery => {
            elementQuery.addListener(updateQueries)
        })
        return () => {
            elementQueries.forEach(elementQuery => {
                elementQuery.removeListener(updateQueries)
            })
        }
    }, [elementQueries, updateQueries])

    return [getRef, style, activeItems]
}
