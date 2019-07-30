import React, { useEffect, useReducer, useRef, useState } from 'react'
import Header from '../Header'
import Movie from '../Movie'
import moment from 'moment'
import MovieFilters from '../models/MovieFilters'
import Slider from '../components/Slider/Slider'
import Feature from '../components/Feature'
import Backdrop from '../components/Backdrop'
import ConditionalRenderHeight from '../components/ConditionalRenderHeight'
import ConditionalRender from '../components/ConditionalRender'
import ConditionalRenderFade from '../components/ConditionalRenderFade'
import './Home.scss'
import './RowDetails.scss'

function movieFilterReducer(state, action) {
    function sortByTitle(a, b) {
        return a.title.localeCompare(b.title)
    }

    switch (action.type) {
        case 'initial-movie-load' :
            return { ...state, allMovies: action.payload, moviesToDisplay: action.payload.sort(sortByTitle), currentSort: ['sort-title-asc']}
        case 'sort-title-asc' :
            return { ...state, moviesToDisplay: state.moviesToDisplay.sort(sortByTitle), currentSort: ['sort-title-asc'] }
        case 'sort-title-desc' :
            return { ...state, moviesToDisplay: state.moviesToDisplay.sort((a, b) => sortByTitle(b, a)), currentSort: ['sort-title-desc'] }
        case 'sort-date-added' :
            return { ...state, moviesToDisplay: state.moviesToDisplay.sort((a, b) => b.metadata.created_date_millis - a.metadata.created_date_millis), currentSort: ['sort-date-added'] }
        case 'sort-release-year' :
            return { ...state, moviesToDisplay: state.moviesToDisplay.sort((a, b) => b.year - a.year), currentSort: ['sort-release-year'] }
        case 'sort-imdb-rating' :
            return { ...state, moviesToDisplay: state.moviesToDisplay.sort((a, b) => b.imdb.rating - a.imdb.rating), currentSort: ['sort-imdb-rating'] }
        case 'filter-seen' : {
            if (state.movieFilters.has(action)) {
                state.movieFilters.remove(action)
            } else {
                state.movieFilters.add(action)
            }

            return { ...state, moviesToDisplay: state.movieFilters.applyFilter(state.allMovies), movieFilters: Object.assign({}, state.movieFilters) }
        }
        default :
            return state
    }
}

function Home(props) {
    console.log('Home.js Render')
    const [state, dispatch] = useReducer(movieFilterReducer, {
        allMovies: [],
        moviesToDisplay: [],
        currentSort: [],
        movieFilters: MovieFilters()
    })
    const [currentlyOpenedMovieDetailsRow, setCurrentlyOpenedMovieDetailsRow] = useState()
    const [currentlyDisplayedMovieDetailsMovie, setCurrentlyDisplayedMovieDetailsMovie] = useState()
    let debounceTimer = null

    const featuredMovies = [
        { 
            uid: '401981',
            title: 'Red Sparrow',
            featureLogo: 'logo_red_sparrow.png',
            featureTrailer: {
                name: 'red_sparrow_trailer.mp4',
                mimeType: 'video/mp4'
            }
        },
        { 
            uid: '284053',
            title: 'Thor: Ragnarok',
            featureLogo: 'logo_thor_ragnarok.png',
            featureTrailer: {
                name: 'thor_ragnarok_trailer.mp4',
                mimeType: 'video/mp4'
            }
        },
        { 
            uid: '383498',
            title: 'Deadpool 2',
            featureLogo: 'logo_deadpool2.png',
            featureTrailer: {
                name: 'deadpool_2_trailer.mp4',
                mimeType: 'video/mp4'
            }
        }
    ]
    const featuredMovie = featuredMovies[Math.floor(Math.random() * featuredMovies.length)]
    const url = '/data/movies.json'

    if (!props.allMovies || props.allMovies.length === 0) {
        return null
    }

    function toggleMovieDetailsVisibility(rowToOpen, clickedMovie) {
        if (rowToOpen === currentlyOpenedMovieDetailsRow) {
            setCurrentlyOpenedMovieDetailsRow('')
            //setCurrentlyDisplayedMovieDetailsMovie('')
        } else {
            setCurrentlyOpenedMovieDetailsRow(rowToOpen)
            setCurrentlyDisplayedMovieDetailsMovie(clickedMovie)
        }
        //setCurrentlyOpenedMovieDetailsRow(rowToOpen === currentlyOpenedMovieDetailsRow ? '' : rowToOpen)
    }

    function debounce(callback, delayMs) {
        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(callback, delayMs)
    }

    function handleOnItemHoveredWhenDetailsVisible(movie) {
        debounce(() => setCurrentlyDisplayedMovieDetailsMovie(movie), 500)
    }

    return (
        <div>
            {/* <Header
                dispatch={dispatch}
                currentSort={state.currentSort}
                currentFilter={state.currentFilter}
                totalMovies={state && state.allMovies.length}
                displayedMovies={state.moviesToDisplay.length}
            /> */}

            {/* <div className='video'>
                <div className='video-background'>
                    <div className='video-foreground'>
                        <iframe src={`${getFeatureVideoLink(state.allMovies[350].trailer)}`} frameBorder="0" allowFullScreen allow='autoplay'></iframe>
                    </div>
                </div>
            </div> */}

            <div id='feature'>
                <Feature 
                    movie={props.feature}
                />
                <div className='bottom-fader'></div>
            </div>

            <main>
                <Row 
                    title='New Releases'
                    currentlyOpenedMovieDetailsRow={currentlyOpenedMovieDetailsRow}
                    currentlyDisplayedMovieDetailsMovie={currentlyDisplayedMovieDetailsMovie}
                    onItemHoveredWhenDetailsVisible={movie => handleOnItemHoveredWhenDetailsVisible(movie)}
                    onMovieDetailsClick={(title, movie) => toggleMovieDetailsVisibility(title, movie)}
                    movies={
                        props.allMovies
                            .filter(movie => moment(movie.release_date) >= moment().subtract(2, 'year'))
                            .sort((a, b) => b.release_date - a.release_date)
                }/>

                <Row
                    title='Kids'
                    currentlyOpenedMovieDetailsRow={currentlyOpenedMovieDetailsRow}
                    currentlyDisplayedMovieDetailsMovie={currentlyDisplayedMovieDetailsMovie}
                    onItemHoveredWhenDetailsVisible={movie => handleOnItemHoveredWhenDetailsVisible(movie)}
                    onMovieDetailsClick={(title, movie) => toggleMovieDetailsVisibility(title, movie)}
                    movies={
                        props.allMovies
                            .filter(movie => movie.genres.includes('Animation') && (movie.rated === 'G' || movie.rated === 'PG'))
                }/>

                <Row
                    title='Comedies'
                    currentlyOpenedMovieDetailsRow={currentlyOpenedMovieDetailsRow}
                    currentlyDisplayedMovieDetailsMovie={currentlyDisplayedMovieDetailsMovie}
                    onItemHoveredWhenDetailsVisible={movie => handleOnItemHoveredWhenDetailsVisible(movie)}
                    onMovieDetailsClick={(title, movie) => toggleMovieDetailsVisibility(title, movie)}
                    movies={
                        props.allMovies
                            .filter(movie => movie.genres.includes('Comedy'))
                }/>
            </main>
        </div>
    )
}

function Row({ title, movies, currentlyOpenedMovieDetailsRow, currentlyDisplayedMovieDetailsMovie, onMovieDetailsClick, onItemHoveredWhenDetailsVisible }) {
    return (
        <div className='row'>
            <RowHeader title={title} />

            <Slider 
                items={movies}
                isDetailsPaneOpen={!!currentlyOpenedMovieDetailsRow}
                onItemHoveredWhenDetailsVisible={movie => onItemHoveredWhenDetailsVisible(movie)}
                render={props => 
                    <Movie
                        key={props.item.uid}
                        onMovieDetailsClick={() => onMovieDetailsClick(title, props.item)}
                        {...props} 
                    />
            } />
            
            <ConditionalRender shouldShow={currentlyOpenedMovieDetailsRow === title} transitions={{
                from: { height: '0vw', opacity: 0 },
                enter: { height: '30vw', opacity: 1 },
                leave: { height: '0vw', opacity: 0 },
                unique: true,
                reset: true
            }}>
                <RowDetails movie={currentlyDisplayedMovieDetailsMovie} shouldShow={currentlyOpenedMovieDetailsRow === title} />
            </ConditionalRender>    
        </div>
    )
}

function RowHeader({ title, numItems }) {
    return (
        <div className='row-header'>
            <div className='row-title'>{ title } { numItems }</div>
        </div>
    )
}

function RowDetails(props) {
    const movie = props.movie
    
    return (
        <ConditionalRenderFade shouldShow={props.movie} key={movie.uid} behavior='molasses'>
            <div className='row-details'>
                <div className='row-details-left'>
                    <div className='title'>{ movie.title }</div>
                    <div className='rated'>{ movie.rated }</div>
                </div>

                <div className='row-details-right'>
                    <Backdrop className='row-details-backdrop' src={movie.backdrop_path} />
                </div>
            </div>
        </ConditionalRenderFade>
    )
}


function getFeatureVideoLink(trailerUrl) {
    console.log(trailerUrl)
    return trailerUrl + '&showinfo=0&controls=0&iv_load_policy=3&loop=1&modestbranding=1'
}

export default Home
