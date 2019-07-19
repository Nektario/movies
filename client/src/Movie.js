import React, { useState } from 'react'
import * as config from './config'
import './Movie.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faMale, faFemale, faBaby, faInfo } from '@fortawesome/free-solid-svg-icons'

// It's too slow to render the Actions and Info components for all items when they mount.
// So instead, they only render for an item once it has been hovered
const POSTER_URL = config.POSTER_URL

const Movie = React.forwardRef(({ item: movie, className, onMouseEnter, onMouseLeave, isVisible, ...rest }, ref) => {
    console.log(movie)
    const [wasHovered, setWasHovered] = useState(false)
    movie.rated = movie.rated ? movie.rated : 'NR'
    
    return (
        <div
            className={`movie ${className}`}
            data-uid={movie.uid}
            data-title={movie.title}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={ref}
            {...rest}
        > 
            { isVisible &&
                <>
                    <img src={`${POSTER_URL}${movie.poster_path}`} alt={movie.name + ' poster'} />

                    <div className='overlay'>
                        <Actions movie={movie} shouldShow={wasHovered} />
                        <Info movie={movie} shouldShow={wasHovered} />
                    </div>
                </>
            }
        </div>
    )

    function handleMouseEnter() {
        onMouseEnter && onMouseEnter()
        setWasHovered(true)
    }

    function handleMouseLeave() {
        onMouseLeave && onMouseLeave()
    }
})

function Info({ shouldShow, movie }) {
    function convertMinsToHours(minutes) {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
    
        return `${hours > 0 ? hours + 'h ' : ''}${mins > 0 ? mins + 'm' : ''}`
    }

    if (shouldShow) {
        return (
            <div className='info'>
                <div className='title'>
                    { movie.title }
                </div>
                <div>
                    <span className='rated'>{ movie.rated }</span>
                    { new Date(movie.release_date).getFullYear() } &bull; { convertMinsToHours(movie.runtime) }
                </div>
                <div>
                    { movie.genres.slice(0, 3).join(', ') }
                </div>
            </div>
        )
    }
    
    return null
}

function Actions({ shouldShow }) {
    if (shouldShow) {
        return (
            <div className='actions'>
                {/* <FontAwesomeIcon icon={faPlay} className='icon' fixedWidth /> */}
                {/* <FontAwesomeIcon icon={faMale} className='icon' fixedWidth />
                <FontAwesomeIcon icon={faFemale} className='icon' fixedWidth />
                <FontAwesomeIcon icon={faBaby} className='icon' fixedWidth /> */}
                <FontAwesomeIcon icon={faInfo} className='icon' fixedWidth />
            </div>
        )
    }

    return null
}

export default Movie