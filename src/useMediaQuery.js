import { useMemo } from 'react'

import useQueries from './useQueries'

const storage = new Map()

export default function useMediaQuery(queries = {}) {
    const mediaQueries = useMemo(() => {
        if (!('matchMedia' in global)) return []
        return Object.keys(queries).map(key => {
            if (!storage.has(key)) storage.set(key, matchMedia(key))
            return { mq: storage.get(key), item: queries[key] }
        })
    }, [queries])
    return useQueries(mediaQueries)
}
