import React, { useState, useRef, useEffect, createRef, useCallback } from 'react'
import useMeasureSlider from './useMeasureSlider'
import { useSpring, animated } from 'react-spring'
import './Slider.scss'
//import { Map } from 'immutable'

function Slider(props) {
    const [visibleItems, setVisibleItems] = useState(new Map())
    const [transforms, setTransforms] = useState({})
    const [scrollDistance, setScrollDistance] = useState(0)
    const [currentScrollPage, setCurrentScrollpage] = useState(1)
    // const [sliderPadding, setSliderPadding] = useState(0)
    // const [sliderWidth, setSliderWidth] = useState(0)
    // const [numItemsPerPage, setNumItemsPerPage] = useState(0)
    const sliderRef = useRef(null)
    // const sliderRefCb = useCallback(node => {
    //     function onWindowSizeChanged() {
    //         if (node !== null)
    //             setSliderWidth(node.clientWidth)
    //     }
    //     window.addEventListener('resize', onWindowSizeChanged)
    //     function parsePixelValue(pixels) {
    //         return parseFloat(pixels.substring(0, pixels.indexOf('px')))
    //     }
        
    //     function measure(element, property) {
    //         const style = window.getComputedStyle(element)
    //         const value = style.getPropertyValue(property)
    
    //         if (value.includes('px')) {
    //             return parsePixelValue(value)
    //         } else {
    //             return value
    //         }
    //     }

    //     if (node !== null) {
    //         const sliderWidth = node.clientWidth
    //         const sliderPadding = measure(node, 'padding-right') * 2
    //         const itemWidth = measure(node.children[0], 'width')
    //         const numItemsPerPage = Math.floor(sliderWidth / itemWidth)
    //         console.log(sliderWidth, sliderPadding, itemWidth, numItemsPerPage)
    //         setSliderWidth(sliderWidth)
    //         setSliderPadding(sliderPadding)
    //         setNumItemsPerPage(numItemsPerPage)
    //     }
    // })
    const sliderScrollPositionStyle = {
        style: { transform: `translateX(${scrollDistance}px)` }
    }
    //const { sliderPadding, sliderWidth, numItemsPerPage } = { sliderPadding: 0, sliderWidth: 0, numItemsPerPage: 0 } //useMeasureSlider(sliderRef, true)
    const { sliderPadding, sliderWidth, numItemsPerPage, refCallback } = useMeasureSlider(true)
    const animProps = useSpring({ transform: `translateX(${scrollDistance}px)`})
    const options = {
        root: document.querySelector('.slider'),
        rootMargin: '100%',
        threshold: '0'
    }
    const itemRefs = useRef(props.items.map(() => createRef()))
    const observer = useRef()

    if (!observer.current) {
        observer.current = new IntersectionObserver((entries, observer) => {
            const newIntersectingState = new Map()
            
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    newIntersectingState.set(entry.target.getAttribute('data-uid'), true)
                } else {
                    newIntersectingState.set(entry.target.getAttribute('data-uid'), false)
                }
            }

            setVisibleItems(current => new Map([...current, ...newIntersectingState]))
        }, options)
    }
    
    useEffect(function setupItemRefs() {
        if (props.items) props.items.forEach((item, i) => {
            observer.current.observe(itemRefs.current[i].current)
        })

    }, [props.items])

    useEffect(function onSliderMeasurementsChanged() {
        if (currentScrollPage > 1) {
            const newScrollDistance = (currentScrollPage - 1) * (-sliderWidth + sliderPadding)
            setScrollDistance(newScrollDistance)
        }
    }, [sliderWidth, sliderPadding, scrollDistance, currentScrollPage])

    useEffect(function removeStylesWhenDetailsOpened() {
        if (props.isDetailsPaneOpen) {
            handleHoverOut()
        }
    }, [props.isDetailsPaneOpen])
    

    function handlePreviousButtonClick() {
        setScrollDistance(scrollDistance => scrollDistance + sliderWidth - sliderPadding)
        setCurrentScrollpage(currentScrollPage => currentScrollPage - 1)
    }
    
    function handleNextButtonClick() {
        setScrollDistance(scrollDistance => scrollDistance + -sliderWidth + sliderPadding)
        setCurrentScrollpage(currentScrollPage => currentScrollPage + 1)
    }

    function areThereMoreScrollItemsToTheLeft() {
        return currentScrollPage > 1
    }

    function areThereMoreScrollItemsToTheRight() {
        const numPages = Math.ceil(props.items.length / numItemsPerPage)

        return numPages > currentScrollPage
    }

    function handleHoverSliderItem(index, edgePosition) {
        let moveLeftAmount = '-10%'
        let moveRightAmount = '10%'
        if (edgePosition === 'left') {
            moveLeftAmount = '0'
            moveRightAmount = '20%'
        }
        if (edgePosition === 'right') {
            moveLeftAmount = '-20%'
            moveRightAmount = '0'
        }
        
        const transition = 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1) 200ms'
        const moveLeft = {
            style: {
                transition: transition,
                transform: `translateX(${moveLeftAmount})` 
            }
        }
        const moveRight = {
            style: {
                transition: transition,
                transform: `translateX(${moveRightAmount})`
            }
        }
        const scale = {
            style: {
                transition: transition,
                transform: 'scale(1.2) translateX(0)'
            }
        }

        // When hovering on an item, we set the left and right items to shift
        const numToShiftOnLeft = index - (numItemsPerPage * (currentScrollPage - 1)) + 1
        const numToShiftOnRight = numItemsPerPage * currentScrollPage - index
        const transforms = {}

        transforms[index] = scale
        for (let i = index - numToShiftOnLeft; i <= index + numToShiftOnRight; i++) {
            if (i < index) transforms[i] = moveLeft
            if (i > index) transforms[i] = moveRight
        }

        setTransforms(transforms)
    }

    function handleHoverOut() {
        setTransforms({})
    }

    return (
        <div className='slider-wrapper'>
            {/* <div className='slider' {...sliderScrollPositionStyle} ref={refCallback}> */}
            <animated.div className='slider' style={animProps} ref={refCallback}>
                { props.items.map((item, i) => {
                    // Items that we need to shift left and/or right
                    const translateXStyles = transforms[i] ? transforms[i] : ''

                    // Find left and right edge item.  
                    // These items have a left/right transform origin instead of center.
                    let classes = ''
                    let edgePosition
                    const itemPosition = i % numItemsPerPage
                    if (itemPosition === 0) {
                        classes = 'slider-item-left-edge'
                        edgePosition = 'left'
                    } else if (itemPosition === numItemsPerPage - 1) {
                        edgePosition = 'right'
                        classes = 'slider-item-right-edge'
                    }

                    return (
                        //<div className='nothing slider-item' ref={itemRefs.current[i]} key={item.uid}>
                            props.render({
                                ref: itemRefs.current[i],
                                item: item,
                                className: `slider-item ${classes}`,
                                onMouseEnter: props.isDetailsPaneOpen ? () => props.onItemHoveredWhenDetailsVisible(item) : () => handleHoverSliderItem(i, edgePosition),
                                onMouseLeave: props.isDetailsPaneOpen ? undefined : handleHoverOut,
                                isVisible: visibleItems.get(item.uid),
                                styles: {...translateXStyles}
                            })
                            // <props.component
                            //     ref={itemRefs.current[i]}
                            //     key={item.uid}
                            //     item={item}
                            //     className={`${classes} slider-item`}
                            //     onMouseEnter={() => handleHoverSliderItem(i, edgePosition)}
                            //     onMouseLeave={handleHoverOut}
                            //     onMovieDetailsClick={props.onMovieDetailsClick}
                            //     isVisible={visibleItems.get(item.uid)}
                            //     {...translateXStyles}
                            // />
                        //</div>
                    )   
                })}
            {/* </div> */}
            </animated.div>
            
            { areThereMoreScrollItemsToTheRight() && <button type='button' className='rightbutton' onClick={handleNextButtonClick}> R </button> }
            { areThereMoreScrollItemsToTheLeft() && <button type='button' className='leftbutton' onClick={handlePreviousButtonClick}> L </button> }
        </div>
    )
}

export default Slider