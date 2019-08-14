import React from 'react'
import Button from './Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'

function PlayButton(props) {
    function playMovie(movie) {
        console.log('Play', movie.title)
    }
    
    return (
        <Button className='play-button' kind={props.kind} onClick={() => playMovie(props.movie)}>
           <FontAwesomeIcon icon={faPlay} className='button-icon' />
            <span>Play</span>
        </Button>
    )
}

export default PlayButton