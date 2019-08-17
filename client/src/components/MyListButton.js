import React, { useContext, useRef, useEffect, useState } from 'react'
import { ReactComponent as PlusToCheckSvg } from './myListButtonIcon.svg'
import * as util from './util'
import MyListContext from '../MyListContext'
import Button from './Button'

const ICON_SIZE = 24
const ICON_NUM_FRAMES = 36

function MyListButton(props) {
    const myList = useContext(MyListContext)
    const [viewBoxXStartPosition] = useState(myList.has(props.movie) ? ICON_SIZE * ICON_NUM_FRAMES : 0)
    const svgRef = useRef()

    function handleClick() {
        myList.update(props.movie)
        util.animateSvgIcon(250, ICON_NUM_FRAMES, !myList.has(props.movie), svgRef.current, ICON_SIZE)
    }

    return (
        <Button className='my-list-button' kind={props.kind} onClick={handleClick}>
            <PlusToCheckSvg viewBox={`${viewBoxXStartPosition} 0 ${ICON_SIZE} ${ICON_SIZE}`} ref={svgRef} />
            <div className='my-list-text'>My List</div>
        </Button>
    )
}

export default MyListButton