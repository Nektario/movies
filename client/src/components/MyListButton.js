import React, { useContext, useRef, useEffect, useState } from 'react'
import { ReactComponent as Logo } from './myListButtonIcon.svg'
import MyListContext from '../MyListContext'
import Button from './Button'

const ICON_WIDTH = 24
const ICON_HEIGHT = 24
const ICON_NUM_FRAMES = 36

function animateSvgIcon(durationMillis, numFrames, forwardsDirection, callback) {
    let counter = forwardsDirection ? 2 : numFrames - 2

    let timer = setInterval(() => {
        const newViewBoxX = ICON_WIDTH * counter
        console.log('newViewBoxX', newViewBoxX)
        callback(newViewBoxX)

        if (!forwardsDirection) {
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
    //const isFirstRunRef = useRef(true)

    function handleClick() {
        myList.update(props.movie)
        animateSvgIcon(250, ICON_NUM_FRAMES, !myList.has(props.movie), setViewBoxX)
    }
    // useEffect(() => {
    //     if (isFirstRunRef.current) {
    //         isFirstRunRef.current = false
    //         return
    //     } 
        
    //     animateSvgIcon(250, ICON_NUM_FRAMES, myList.has(props.movie), setViewBoxX)
    // }, [myList, props.movie])

    useEffect(() => {
        console.log(viewBoxX)
    })
    return (
        <Button className='my-list-button' kind={props.kind} onClick={handleClick}>
            <div className='my-list-button-icon-container'>
                <Logo viewBox={`${viewBoxX} 0 ${ICON_WIDTH} ${ICON_HEIGHT}`}/>
            </div>
            
            <div className='my-list-text'>My List</div>
        </Button>
    )
}

export default MyListButton