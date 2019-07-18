import { useCallback, useEffect, useReducer, useRef } from 'react'

const WINDOW_RESIZE_DEBOUNCE_MILLIS = 50
const initialState = {
    sliderWidth: 0,
    sliderPadding: 0,
    numItemsPerPage: 0
}

function sliderStateReducer(state, action) {
    switch(action.type) {
        case 'measured' :
            return {
                ...state,
                ...action.payload
            }
        default :
            throw new Error('Invalid action')
    }
}

const measure = function(slider, currState, dispatch) {
    function parsePixelValue(pixels) {
        return parseFloat(pixels.substring(0, pixels.indexOf('px')))
    }
    
    function getAttributeSize(element, property) {
        const style = window.getComputedStyle(element)
        const value = style.getPropertyValue(property)
        
        if (value.includes('px')) {
            return parsePixelValue(value)
        } else {
            return value
        }
    }

    if (slider) {
        const sliderWidth = slider.clientWidth
        const sliderPadding = getAttributeSize(slider, 'padding-right') * 2
        const itemWidth = getAttributeSize(slider.children[0], 'width')
        const numItemsPerPage = Math.floor(sliderWidth / itemWidth)
        //console.log('Measurement:', sliderWidth, sliderPadding, itemWidth, numItemsPerPage)
      
        if (sliderWidth !== currState.sliderWidth || sliderPadding !== currState.sliderPadding || numItemsPerPage !== currState.numItemsPerPage) {
            dispatch({
                type: 'measured',
                payload: {
                    sliderWidth,
                    sliderPadding,
                    numItemsPerPage
                }
            })
        }
    }
}

/**
 * Hook that measures multiple data points of a slider.
 * Measures the slider's width, padding, and the number of items per page
 * 
 * @param {boolean} [shouldUpdateOnWindowResize=true] - Should the slider be measured again when the browser window is resized (default = true)
 * @param {function} [onWindowResize] - Optional callback when the window is resized
 * 
 * @return { Object } - { sliderWidth, sliderPadding, itemWidth, numItemsPerPage }
 */
function useMeasure(shouldUpdateOnWindowResize = true, onWindowResize) {
    const [state, dispatch] = useReducer(sliderStateReducer, initialState)
    const sliderRef = useRef()
  
    const refCallback = useCallback(slider => {
        sliderRef.current = slider
        measure(sliderRef.current, state, dispatch)
    }, [state])
  
    useEffect(function getMeasurements() {
        measure(sliderRef.current, state, dispatch)
    })
  
    useEffect(function windowResizeListener() {
        let timer = null

        function debounce(callback, delayMs) {
            clearTimeout(timer)
            timer = setTimeout(callback, delayMs)
        }

        function onWindowSizeChanged() {
            debounce(() => {
                measure(sliderRef.current, state, dispatch)
                
                if (typeof onWindowResize === 'function') {
                    onWindowResize()
                }
            }, WINDOW_RESIZE_DEBOUNCE_MILLIS)
        }
        
        if (shouldUpdateOnWindowResize) {
            window.addEventListener('resize', onWindowSizeChanged)
            
            return function() {
                window.removeEventListener('resize', onWindowSizeChanged)
            }
        }
    }, [onWindowResize, shouldUpdateOnWindowResize, state])

    return { ...state, refCallback }
}

export default useMeasure