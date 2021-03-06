import React from 'react'
import * as config from '../config'

function MovieLogo(props) {
    const url = config.FEATURE_LOGO_URL + '/' + props.src
    
    return (
        <img src={url} alt='Movies logo' aria-label='Movies logo' />
    )
}

export default MovieLogo