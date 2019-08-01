import React, { useRef, useState, useLayoutEffect, useEffect } from 'react'
import Movie from '../Movie'
import Slider from '../components/Slider/Slider'
import Backdrop from '../components/Backdrop'
import ConditionalRender from '../components/ConditionalRender'
import CrossfadeItems from './animations/CrossfadeItems'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVideo } from '@fortawesome/free-solid-svg-icons'
import '../views/Home.scss'
import '../views/RowDetails.scss'

const ROW_DETAILS_HEIGHT = '33vw'

function debounce(callback, debounceTimer, delayMs) {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(callback, delayMs)
}

function convertVwToPixels(sizeInVw) {
    sizeInVw = sizeInVw.replace('vw', '')
    const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    return (sizeInVw * width) / 100;
  }

function MovieSliderRow({ rowTitle, shouldOpen, movies, onMovieDetailsClick }) {
    const [currentlyDisplayedMovieDetailsMovie, setCurrentlyDisplayedMovieDetailsMovie] = useState()
    const detailsPaneRef = useRef()
    const detailsPaneRectRef = useRef()
    const isAnItemHoveredWhenDetailsPaneIsOpen = useRef()
    const isDetailsPaneOpen = shouldOpen
    let debounceTimer

    function handleItemHovered(movie) {
        if (isDetailsPaneOpen) {
            isAnItemHoveredWhenDetailsPaneIsOpen.current = true
            debounce(() => {
                if (isAnItemHoveredWhenDetailsPaneIsOpen.current) {
                    setCurrentlyDisplayedMovieDetailsMovie(movie)
                }
            }, debounceTimer, 250)
        }
    }

    function handleItemHoveredOut() {
        isAnItemHoveredWhenDetailsPaneIsOpen.current = false
    }

    function handleOnMovieDetailsClick(rowTitle, movie) {
        onMovieDetailsClick(rowTitle, movie)
        setCurrentlyDisplayedMovieDetailsMovie(movie)
    }

    function handleCloseButtonClick() {
        onMovieDetailsClick(rowTitle)
    }

    useLayoutEffect(function getDetailsPaneMeasurements() {
        // This does not return accurate sizes unless we wait at least 100ms before measuring.
        debounce(() => {
            if (detailsPaneRef.current) {
                detailsPaneRectRef.current = detailsPaneRef.current.getBoundingClientRect()
                detailsPaneRectRef.current.height = convertVwToPixels(ROW_DETAILS_HEIGHT)
            }
        }, debounceTimer, 200)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(function scrollToMiddleOfDetailsPane() {
        if (isDetailsPaneOpen && detailsPaneRef.current) {
            window.scrollTo({ top: detailsPaneRectRef.current.top - detailsPaneRectRef.current.height / 2, behavior: 'smooth'})
        }
    }, [isDetailsPaneOpen])

    return (
        <div className='row' key={rowTitle}>
            <div className='row-header'>
                <div className='row-title'>{ rowTitle }</div>
            </div>

            <Slider 
                items={movies}
                isDetailsPaneOpen={isDetailsPaneOpen}
                onItemHovered={handleItemHovered}
                onItemHoveredOut={handleItemHoveredOut}
                render={props => 
                    <Movie
                        key={props.item.uid}
                        shouldShowOverlay={!isDetailsPaneOpen}
                        onMovieDetailsClick={() => handleOnMovieDetailsClick(rowTitle, props.item)}
                        {...props} 
                    />
            } />

            <div ref={detailsPaneRef}>
                <ConditionalRender shouldShow={isDetailsPaneOpen} transitions={{
                    from: { height: '0vw', opacity: 0 },
                    enter: { height: ROW_DETAILS_HEIGHT, opacity: 1 },
                    leave: { height: '0vw', opacity: 0, },
                    unique: true,
                    reset: true
                }}>
                    <MovieSliderRowDetails
                        movie={currentlyDisplayedMovieDetailsMovie}
                        shouldShow={isDetailsPaneOpen}
                        onCloseButtonClick={handleCloseButtonClick}
                    />
                </ConditionalRender>  
            </div>
        </div>
    )
}

function MovieSliderRowDetails(props) {
    const movie = props.movie
    const [title, subtitle] = movie.title.split(': ')
    const rated = movie.rated ? movie.rated : 'NR'

    function convertMinsToHours(minutes) {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60

        return `${hours > 0 ? hours + 'h ' : ''}${mins > 0 ? mins + 'm' : ''}`
    }

    return (
        <div className='row-details' style={{ height: ROW_DETAILS_HEIGHT }}>
            <div className='row-details-left'>
                <ConditionalRender className='row-details-left-anim-container' key={'row-details-left' + movie.uid} shouldShow={props.shouldShow} transitions={{
                    from: { opacity: 0, transform: 'translateX(5%)' },
                    enter: { opacity: 1, transform: 'translateX(0)' },
                    leave: { opacity: 0, transform: 'translateX(-50%)' },
                }}>
                    <div className='section'>
                        <div className='title'>{ title }</div>
                        { subtitle && <div className='subtitle'>{ subtitle }</div> }
                        { movie.tagline && <div className='tagline'>{ movie.tagline }</div> }
                    </div>

                    <div className='section stats'>
                        <div className='rated'>
                            <div>
                                { rated }
                            </div>
                        </div>
                        { new Date(movie.release_date).getFullYear() } &bull; { convertMinsToHours(movie.runtime) } &bull; { movie.genres.slice(0, 3).join(', ') }
                    </div>
                    
                    <div className='plot'>{ movie.overview }</div>

                    <div className='credits'>
                        <div>{ movie.credits.cast.slice(0, 3).map(cast => cast.name).join(', ') }</div>
                        <div>
                            { movie.credits.crew
                                .filter(crew => crew.job === 'Director')
                                .map(director => {
                                    return (
                                        <span className='director' key={'director-' + director.name}>
                                            <FontAwesomeIcon icon={faVideo} className='icon director-icon' />{ director.name }
                                        </span>
                                    )
                                })
                            }
                        </div>
                    </div>
                </ConditionalRender>
            </div>

            <CrossfadeItems
                className='row-details-right'
                item={movie}
                render={props => 
                    <Backdrop
                        className='row-details-backdrop'
                        src={props.item.backdrop_path}
                        style={{height: ROW_DETAILS_HEIGHT}}
                        alt={props.item.title + ' backdrop'}
                    />
                }
            />

            <div className='row-details-close-button' onClick={props.onCloseButtonClick}>
                &times;
            </div>
        </div>
    )
}

export default MovieSliderRow