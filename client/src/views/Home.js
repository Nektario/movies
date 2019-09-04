import React, { useState } from 'react'
import { useMyListHelper } from '../my-list-context'
import Header from '../components/Header'
import moment from 'moment'
import MovieSliderRow from '../components/MovieSliderRow'
import Feature from '../components/Feature'
import './Home.scss'

function Home(props) {
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


    function toggleMovieDetailsVisibility(titleOfClickedRow) {
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
            <div id='feature'>
                <Feature
                    movie={props.feature}
                />
                <div className='bottom-fader'></div>
            </div>

            <main>
                { rows.map(row => 
                    <MovieSliderRow
                        key={row.title}
                        rowTitle={row.title}
                        onMovieDetailsClick={(title) => toggleMovieDetailsVisibility(title)}
                        shouldOpen={currentlyOpenedMovieDetailsRow === row.title}
                        movies={row.movies}
                    />)
                }
            </main>
        </div>
    )
}

export default Home
