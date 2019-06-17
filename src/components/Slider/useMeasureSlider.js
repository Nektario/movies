import { useEffect, useLayoutEffect, useReducer } from 'react'

const initialState = {sliderWidth:0, sliderPadding: 0, itemWidth: 0, numItemsPerPage: 0}

function sliderStateReducer(state, action) {
    switch(action.type) {
        case 'slider-width-changed' :
            return { ...state, sliderWidth: action.payload }
        case 'slider-measured' :
            return { 
                sliderWidth: action.payload.sliderWidth,
                sliderPadding: action.payload.sliderPadding,
                itemWidth: action.payload.itemWidth,
                numItemsPerPage: action.payload.numItemsPerPage
            }
    }
}

/**
 * Hook that measures multiple data points of a slider.
 * Measures the slider's width, padding, the width of the slider items, and the number of items per page
 * 
 * @param {ref} sliderRef - The ref to the slider's DOM node as returned by useRef
 * @param {boolean} [shouldUpdateOnWindowResize=true] - Should the slider be measured again when the browser window is resized (default = true)
 * @param {function} [onWindowResize] - Optional callback when the window is resized
 * 
 * @return { Object } - { sliderWidth, sliderPadding, itemWidth, numItemsPerPage }
 */
const useMeasureSlider = (sliderRef, shouldUpdateOnWindowResize = true, onWindowResize) => {
    const [state, dispatch] = useReducer(sliderStateReducer, initialState)

    useEffect(() => {
        let timer = null
        function debounce(callback, delayMs) {
            clearTimeout(timer)
            timer = setTimeout(callback, delayMs)
        }

        function onWindowSizeChanged() {
            debounce(() => {
                dispatch({ type: 'slider-width-changed', payload: sliderRef.current.clientWidth })
                if (typeof onWindowResize === 'function') {
                    onWindowResize()
                }
            }, 25)
        }
        
        if (shouldUpdateOnWindowResize) {
            window.addEventListener('resize', onWindowSizeChanged)

            return function() {
                window.removeEventListener('resize', onWindowSizeChanged)
            }
        }
    }, [onWindowResize, shouldUpdateOnWindowResize, sliderRef])

    useLayoutEffect(() => {
        function parsePixelValue(pixels) {
            return parseFloat(pixels.substring(0, pixels.indexOf('px')))
        }
        
        function measure(element, property) {
            const style = window.getComputedStyle(element)
            const value = style.getPropertyValue(property)
    
            if (value.includes('px')) {
                return parsePixelValue(value)
            } else {
                return value
            }
        }

        const sliderWidth = sliderRef.current.clientWidth
        const sliderPadding = measure(sliderRef.current, 'padding-right') * 2
        const itemWidth = measure(sliderRef.current.children[0], 'width')
        const numItemsPerPage = Math.floor(sliderWidth / itemWidth)

        dispatch({ type: 'slider-measured', payload: { sliderWidth, sliderPadding, itemWidth, numItemsPerPage }})
    }, [sliderRef, state.sliderWidth])

    return { ...state }
}

export default useMeasureSlider