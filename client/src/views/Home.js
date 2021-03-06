import React from 'react'
import moment from 'moment'
import { useMyListHelper } from '../my-list-context'
import HorizontallyScrollableRowView from './HorizontallyScrollableRowView'
import Feature from '../components/Feature'
import './Home.scss'

function Home(props) {
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
            title: 'Top Rated',
            movies: props.allMovies
                .filter(movie => movie.vote_average > 7)
                .sort((a, b) => b.vote_average - a.vote_average)
        },
        {
            title: 'Kids',
            movies: props.allMovies
                .filter(movie => movie.rated === 'G' || (movie.genres.includes('Animation') && (movie.rated === 'G' || movie.rated === 'PG')))
        },
        {
            title: 'Comedy',
            movies: props.allMovies
                .filter(movie => movie.genres.includes('Comedy'))
        }
        ,
        {
            title: 'Action',
            movies: props.allMovies
                .filter(movie => movie.genres.includes('Action'))
        }
    ]


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

            <div className='content'>
                <HorizontallyScrollableRowView rows={rows} />
            </div>
        </div>
    )
}

export default Home
