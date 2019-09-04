import React, { useRef, useState } from 'react'
import { ReactComponent as PlusToCheckSvg } from './myListButtonIcon.svg'
import { useMyListDispatch, useMyListHelper } from '../my-list-context'
import * as util from '../util'
import Button from './Button'

const ICON_SIZE = 24
const ICON_NUM_FRAMES = 36

function MyListButton(props) {
    const [myListHelper, myListDispatch] = [useMyListHelper(), useMyListDispatch()]
    const [viewBoxXStartPosition] = useState(myListHelper.isInMyList(props.movie) ? ICON_SIZE * ICON_NUM_FRAMES : 0)
    const svgRef = useRef()

    function handleClick() {
        util.animateSvgIcon(300, ICON_NUM_FRAMES, !myListHelper.isInMyList(props.movie), svgRef.current, ICON_SIZE)
        myListDispatch({ type: 'toggle', data: props.movie })
    }

    return (
        <Button className='my-list-button' kind={props.kind} onClick={handleClick}>
            <PlusToCheckSvg viewBox={`${viewBoxXStartPosition} 0 ${ICON_SIZE} ${ICON_SIZE}`} ref={svgRef} />
            <div className='my-list-text'>My List</div>
        </Button>
    )
}

export default MyListButton