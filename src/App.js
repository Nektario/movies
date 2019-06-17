import React, { useEffect, useReducer } from 'react'
import Header from './Header'
import Movie from './Movie'
import axios from 'axios'
import MovieFilters from './models/MovieFilters'
import Slider from './components/Slider/Slider'
import './App.scss'

function movieFilterReducer(state, action) {
    function sortByTitle(a, b) {
        return a.title.localeCompare(b.title)
    }

    switch (action.type) {
        case 'set' :
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
    //const url = 'http://192.168.86.2:8090/movies'
    const url = 'data/movies.json'

    useEffect(() => {
        axios.get(url)
            .then(response => {
                if (response.data) {
                    dispatch({ type: 'set', payload: response.data.items })
                }
            })
            .catch(e => console.log(e))
    }, [])

    if (state.allMovies.length === 0) {
        return null
    }

    return (
        <div>
            <Header
                dispatch={dispatch}
                currentSort={state.currentSort}
                currentFilter={state.currentFilter}
                totalMovies={state && state.allMovies.length}
                displayedMovies={state.moviesToDisplay.length}
            />

            {/* <div className='video'>
                <iframe src={`${getFeatureVideoLink(state.allMovies[350].trailer)}`} frameBorder="0" allowFullScreen allow='autoplay'></iframe>
            </div> */}

            <main>
                <Row title='Recentaly Added' items={
                    state.moviesToDisplay
                        .filter(movie => movie.metadata.created_date_millis > new Date().getTime() - 365 * 24 * 60 * 60 * 1000)
                        .sort((a, b) => b.metadata.created_date_millis - a.metadata.created_date_millis)
                }/>

                <Row title='Kids' items={
                    state.moviesToDisplay
                        .filter(movie => movie.genres.includes('Animation') && (movie.rated === 'G' || movie.rated === 'PG'))
                }/>

                <Row title='Comedies' items={
                    state.moviesToDisplay
                        .filter(movie => movie.genres.includes('Comedy'))
                }/>
            </main>
        </div>
    )
}

function Row({ title, items }) {
    return (
        <div className='row'>
            <RowHeader title={title} numItems={items.length} />
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
