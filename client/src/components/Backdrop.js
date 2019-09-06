import React from 'react'
import * as config from '../config'
import './Backdrop.scss'

function Backdrop(props) {
    const [isLoaded, setIsLoaded] = React.useState(false)
    const url = config.BACKDROP_URL + props.src
    
    let imgClass = ''
    if (props.shouldFadeIn) {
        if (isLoaded) {
            imgClass = 'show'
        } else {
            imgClass = 'hide'
        }
    }

    return (
        <div className={'backdrop ' + props.className} role='img' aria-label='Backdrop poster of movie'>
            <img 
                src={url}
                className={imgClass}
                style={props.style}
                alt={props.alt ? props.alt : 'Backdrop poster of movie'}
                onLoad={() => setIsLoaded(true)}
            />
        </div>
    )
}

export default Backdrop