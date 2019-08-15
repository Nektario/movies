import React, { useContext, useRef, useEffect, useState } from 'react'
import { ReactComponent as Logo } from './myListButtonIcon.svg'
import MyListContext from '../MyListContext'
import Button from './Button'

const ICON_WIDTH = 24
const ICON_HEIGHT = 24
const ICON_NUM_FRAMES = 36

function animateSvgIcon(durationMillis, numFrames, startFromBeginning, callback) {
    let counter = startFromBeginning ? 1 : numFrames

    let timer = setInterval(() => {
        const newViewBoxX = ICON_WIDTH * counter
        callback(newViewBoxX)

        if (!startFromBeginning) {
            if (counter === 1) {
                clearInterval(timer)
            }
            counter--
        } else {
            if (counter === numFrames) {
                clearInterval(timer)
            }
            counter++
        }
    }, durationMillis / numFrames)
}

function MyListButton(props) {
    const myList = useContext(MyListContext)
    const [viewBoxX, setViewBoxX] = useState(myList.has(props.movie) ? ICON_WIDTH * ICON_NUM_FRAMES : 0)
    const isFirstRunRef = useRef(true)

    useEffect(() => {
        if (isFirstRunRef.current) {
            isFirstRunRef.current = false
            return
        } 
        
        animateSvgIcon(250, ICON_NUM_FRAMES, myList.has(props.movie), setViewBoxX)
    }, [myList, props.movie])

    return (
        <Button className='my-list-button' kind={props.kind} onClick={() => myList.update(props.movie)}>
            <div className='my-list-button-icon-container'>
                <Logo viewBox={`${viewBoxX} 0 ${ICON_WIDTH} ${ICON_HEIGHT}`}/>
            </div>
            
            <div className='my-list-text'>My List</div>
        </Button>
    )
}

export default MyListButton