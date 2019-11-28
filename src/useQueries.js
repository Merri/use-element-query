import { useCallback, useEffect, useState } from 'react'

export default function useQueries(mediaQueries) {
    const [activeItems, setActiveItems] = useState([])

    const updateQueries = useCallback(() => {
        const nextActiveItems = mediaQueries.reduce((nextActiveItems, item) => {
            if (item.mq.matches) nextActiveItems.push(item.value)
            return nextActiveItems
        }, [])
        if (
            nextActiveItems.length !== activeItems.length ||
            nextActiveItems.some((activeItem, index) => activeItems[index] !== activeItem)
        ) {
            setActiveItems(nextActiveItems)
        }
    }, [activeItems, mediaQueries])

    useEffect(() => {
        if (mediaQueries.length === 0) return
        updateQueries()
        mediaQueries.forEach(item => {
            item.mq.addListener(updateQueries)
        })
        return () => {
            mediaQueries.forEach(item => {
                item.mq.removeListener(updateQueries)
            })
        }
    }, [mediaQueries, updateQueries])

    return activeItems
}
