import React, { useState, useRef, useEffect } from 'react'
import { ReactComponent as StarSvg } from './userRatingIcon.svg'
import * as util from '../util'

const ICON_SIZE = 24
const ICON_NUM_FRAMES = 54

function UserRating(props) {
    const [viewBoxXStartPosition] = useState(0)
    const svgRef = useRef()

    useEffect(() => {
        const timer = setTimeout(() => {
            util.animateSvgIcon(1500, ICON_NUM_FRAMES, true, svgRef.current, ICON_SIZE)
        }, 3000)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div className='user-rating'>
            <div className='user-rating-icon-container'>
                <StarSvg viewBox={`${viewBoxXStartPosition} 0 ${ICON_SIZE} ${ICON_SIZE}`} ref={svgRef} />
            </div>
            { props.movie.vote_average }
        </div>
    )
}

export default UserRating