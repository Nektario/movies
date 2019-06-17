import React, { useState, useRef, useEffect } from 'react'
import useMeasureSlider from './useMeasureSlider'
import './Slider.scss'

function Slider(props) {
    const [transforms, setTransforms] = useState({})
    const [scrollDistance, setScrollDistance] = useState(0)
    const [currentScrollPage, setCurrentScrollpage] = useState(1)
    const sliderRef = useRef(null)
    const sliderScrollPositionStyle = {
        style: { transform: `translateX(${scrollDistance}px)` }
    }
    const { sliderPadding, sliderWidth, numItemsPerPage } = useMeasureSlider(sliderRef, true)

    useEffect(function onSliderMeasurementsChanged() {
        if (currentScrollPage > 1) {
            const newScrollDistance = (currentScrollPage - 1) * (-sliderWidth + sliderPadding)
            setScrollDistance(newScrollDistance)
        }
    }, [sliderWidth, sliderPadding, scrollDistance, currentScrollPage])
    
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
        
        const transition = 'transform 250ms ease 200ms'
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

        // When hovering on an item, we set the left and right items to shift
        const numToShiftOnLeft = index - (numItemsPerPage * (currentScrollPage - 1)) + 1
        const numToShiftOnRight = numItemsPerPage * currentScrollPage - index
        const transforms = {}
        for (let i = index - numToShiftOnLeft; i <= index + numToShiftOnRight; i++) {
            if (i < index) transforms[i] = moveLeft
            if (i > index) transforms[i] = moveRight
        }

        setTransforms(transforms)
    }

    function handleHoverOut() {
        setTransforms({})
    }

    //console.log('render', sliderWidth, sliderPadding, scrollDistance)
    return (
        <div className='slider-wrapper'>
            <div className='slider' {...sliderScrollPositionStyle} ref={sliderRef}>
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
                                <props.component
                                    key={item._id.$oid}
                                    item={item}
                                    className={`slider-item ${classes}`}
                                    onMouseEnter={() => handleHoverSliderItem(i, edgePosition)}
                                    onMouseLeave={handleHoverOut}
                                    {...translateXStyles}
                                />
                            )   
                        })}
            </div>
            
            { areThereMoreScrollItemsToTheRight() && <button type='button' className='rightbutton' onClick={handleNextButtonClick}> R </button> }
            { areThereMoreScrollItemsToTheLeft() && <button type='button' className='leftbutton' onClick={handlePreviousButtonClick}> L </button> }
        </div>
    )
}

export default Slider