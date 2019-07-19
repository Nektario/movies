import React from 'react'
import * as config from '../config'

function Backdrop(props) {
    const url = config.BACKDROP_URL + props.src
    
    return (
        <div className={'backdrop ' + props.className}>
            <img src={url} alt='backdrop' />
        </div>
    )
}

export default Backdrop