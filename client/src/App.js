import React, { useEffect, useReducer, useRef } from 'react'
import Header from './Header'
import Movie from './Movie'
import axios from 'axios'
import moment from 'moment'
import MovieFilters from './models/MovieFilters'
import Slider from './components/Slider/Slider'
import Feature from './components/Feature'
import './App.scss'

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

function App() {
    const [state, dispatch] = useReducer(movieFilterReducer, {
        allMovies: [],
        moviesToDisplay: [],
        currentSort: [],
        movieFilters: MovieFilters()
    })

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

    useEffect(() => {
        axios.get(url)
            .then(response => {
                if (response.data) {
                    dispatch({ type: 'initial-movie-load', payload: response.data.items })
                }
            })
            .catch(e => console.log(e))
    }, [])

    if (state.allMovies.length === 0) {
        return null
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
                    movie={state.allMovies
                        .filter(movie => movie.uid === featuredMovie.uid)
                        .map(movie => ({ ...movie, ...featuredMovie}))[0]}
                />
                <div className='bottom-fader'></div>
            </div>

            <main>
                <Row title='New Releases' items={
                    state.allMovies
                        .filter(movie => moment(movie.release_date) >= moment().subtract(2, 'year'))
                        .sort((a, b) => b.release_date - a.release_date)
                }/>

                <Row title='Kids' items={
                    state.allMovies
                        .filter(movie => movie.genres.includes('Animation') && (movie.rated === 'G' || movie.rated === 'PG'))
                }/>

                <Row title='Comedies' items={
                    state.allMovies
                        .filter(movie => movie.genres.includes('Comedy'))
                }/>
            </main>
        </div>
    )
}

function Row({ title, items }) {
    return (
        <div className='row'>
            <RowHeader title={title} />
            <Slider items={items} component={Movie} />
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

function getFeatureVideoLink(trailerUrl) {
    console.log(trailerUrl)
    return trailerUrl + '&showinfo=0&controls=0&iv_load_policy=3&loop=1&modestbranding=1'
}

export default App
