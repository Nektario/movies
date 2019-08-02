import React, { useState, useRef, useEffect, createRef, useLayoutEffect } from 'react'
import useMeasureSlider from './useMeasureSlider'
import { useSpring, animated } from 'react-spring'
import './Slider.scss'

function Slider(props) {
    const [visibleItems, setVisibleItems] = useState(new Map())
    const [transforms, setTransforms] = useState({})
    const [scrollDistance, setScrollDistance] = useState(0)
    const [currentScrollPage, setCurrentScrollpage] = useState(1)
    const [wasNewItemAdded, setWasNewItemAdded] = useState() // need to trigger a re-render if new items are added to the slider in order to update the refs
    const { sliderPadding, sliderWidth, numItemsPerPage, refCallback } = useMeasureSlider(true)
    const slideAnimationProps = useSpring({ transform: `translateX(${scrollDistance}px)`})
    const sliderId = 'slider-' + props.id

    // IntersectionObserver
    const intersectionObserverOptions = {
        root: document.getElementById(sliderId),
        rootMargin: '100%',
        threshold: '0'
    }
    const sliderItemRefs = useRef(props.items.map(() => createRef()))
    const intersectionObserver = useRef()

    if (!intersectionObserver.current) {
        intersectionObserver.current = new IntersectionObserver((entries, observer) => {
            const newIntersectingState = new Map()
            
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    newIntersectingState.set(entry.target.getAttribute('data-uid'), true)
                } else {
                    newIntersectingState.set(entry.target.getAttribute('data-uid'), false)
                }
            }

            setVisibleItems(current => new Map([...current, ...newIntersectingState]))
        }, intersectionObserverOptions)
    }
    
    useLayoutEffect(function setupItemRefs() {
        if (props.items) {
            props.items.forEach((item, i) => {
                if (sliderItemRefs.current[i]) {
                    intersectionObserver.current.observe(sliderItemRefs.current[i].current)
                } else {
                    sliderItemRefs.current[i] = createRef()
                    setWasNewItemAdded(Math.random()+'')
                }
            })
        }
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

    useEffect(function disableIntersectionObserver() {
        return () => intersectionObserver.current.disconnect()
    }, [])
    

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
        props.onItemHovered(props.items[index])

        if (!props.isDetailsPaneOpen) {
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
    }

    function handleHoverOut() {
        props.onItemHoveredOut()
        setTransforms({})
    }

    return (
        <div className='slider-wrapper'>
            <animated.div className='slider' id={sliderId} style={slideAnimationProps} ref={refCallback}>
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
                        props.render({
                            ref: sliderItemRefs.current[i],
                            item: item,
                            className: `slider-item ${classes}`,
                            onMouseEnter: () => handleHoverSliderItem(i, edgePosition),
                            onMouseLeave: handleHoverOut,
                            isVisible: visibleItems.get(item.uid),
                            styles: {...translateXStyles}
                        })
                    )   
                })}
            </animated.div>
            
            { areThereMoreScrollItemsToTheRight() && <button type='button' className='rightbutton' onClick={handleNextButtonClick}> &rang; </button> }
            { areThereMoreScrollItemsToTheLeft() && <button type='button' className='leftbutton' onClick={handlePreviousButtonClick}> &lang; </button> }
        </div>
    )
}

export default Slider