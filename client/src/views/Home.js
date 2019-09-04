import React, { useReducer, useState } from 'react'
import { useMyListHelper } from '../my-list-context'
import usePersistentState from '../hooks/usePersistentState'
import { useTransition, animated, config } from 'react-spring'
import Header from '../components/Header'
import Movie from '../Movie'
import moment from 'moment'
import MovieFilters from '../models/MovieFilters'
import Slider from '../components/Slider/Slider'
import MovieSliderRow from '../components/MovieSliderRow'
import Feature from '../components/Feature'
import Backdrop from '../components/Backdrop'
import ConditionalRender from '../components/ConditionalRender'
import ConditionalRenderFade from '../components/ConditionalRenderFade'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVideo } from '@fortawesome/free-solid-svg-icons'
import './Home.scss'

const ROW_DETAILS_HEIGHT = '30vw'

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
    const [state, dispatch] = useReducer(movieFilterReducer, {
        allMovies: [],
        moviesToDisplay: [],
        currentSort: [],
        movieFilters: MovieFilters()
    })
    const [currentlyOpenedMovieDetailsRow, setCurrentlyOpenedMovieDetailsRow] = useState()
    const myListHelper = useMyListHelper()
    const rows = [
        {
            title: 'My List',
            movies: props.allMovies
                .filter(movie => myListHelper.isInMyList(movie))
                .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
        },
        {
            title: 'New Releases',
            movies: props.allMovies
                .filter(movie => moment(movie.release_date) >= moment().subtract(2, 'year'))
                .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
        },
        {
            title: 'Kids',
            movies: props.allMovies
                .filter(movie => movie.rated === 'G' || (movie.genres.includes('Animation') && (movie.rated === 'G' || movie.rated === 'PG')))
        },
        {
            title: 'Comedies',
            movies: props.allMovies
                .filter(movie => movie.genres.includes('Comedy'))
        }
    ]

    function toggleMovieDetailsVisibility(titleOfClickedRow, clickedMovie) {
        if (titleOfClickedRow === currentlyOpenedMovieDetailsRow) {
            setCurrentlyOpenedMovieDetailsRow('')
        } else {
            setCurrentlyOpenedMovieDetailsRow(titleOfClickedRow)
        }
    }

    if (!props.allMovies || props.allMovies.length === 0) {
        return null
    }

    return (
        <div className='home'>
            {/* <Header
                dispatch={dispatch}
                currentSort={state.currentSort}
                currentFilter={state.currentFilter}
                totalMovies={state && state.allMovies.length}
                displayedMovies={state.moviesToDisplay.length}
            /> */}

            <Header />

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
            {/* { rows.filter(row => row.movies.length > 0).map(row =>  */}
                { rows.map(row => 
                    <MovieSliderRow
                        key={row.title}
                        rowTitle={row.title}
                        onMovieDetailsClick={(title, movie) => toggleMovieDetailsVisibility(title, movie)}
                        shouldOpen={currentlyOpenedMovieDetailsRow === row.title}
                        movies={row.movies}
                    />)
                }
            </main>
        </div>
    )
}

export default Home
