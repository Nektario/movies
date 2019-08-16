import React, { useState } from 'react'
import * as config from './config'
import './Movie.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faMale, faFemale, faBaby, faInfo } from '@fortawesome/free-solid-svg-icons'

// It's too slow to render the Actions and Info components for all items when they mount.
// So instead, they only render for an item once it has been hovered
const POSTER_URL = config.POSTER_URL

const Movie = React.forwardRef(({ item: movie, shouldShowOverlay, className, onMouseEnter, onMouseLeave, isVisible, onMovieDetailsClick, styles }, ref) => {
    const [wasHovered, setWasHovered] = useState(false)
    movie.rated = movie.rated ? movie.rated : 'NR'
    
    return (
        <div
            ref={ref}
            className={'movie ' + className}
            data-uid={movie.uid}
            data-title={movie.title}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={styles.style}
        >
            { isVisible &&
                <>
                    <img src={`${POSTER_URL}${movie.poster_path}`} alt={movie.title + ' poster'} />

                    <div className='overlay'>
                        <Actions movie={movie} shouldShow={wasHovered && shouldShowOverlay} onMovieDetailsClick={onMovieDetailsClick} />
                        <Info movie={movie} shouldShow={wasHovered && shouldShowOverlay} />
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

function Actions({ shouldShow, onMovieDetailsClick }) {
    if (shouldShow) {
        return (
            <div className='actions'>
                {/* <FontAwesomeIcon icon={faPlay} className='icon' fixedWidth /> */}
                {/* <FontAwesomeIcon icon={faMale} className='icon' fixedWidth />
                <FontAwesomeIcon icon={faFemale} className='icon' fixedWidth />
                <FontAwesomeIcon icon={faBaby} className='icon' fixedWidth /> */}
                <FontAwesomeIcon icon={faInfo} className='icon icon-hoverable' fixedWidth onClick={onMovieDetailsClick} />
            </div>
        )
    }

    return null
}

export default Movie