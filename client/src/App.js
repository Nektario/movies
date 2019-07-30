import React, { useEffect, useReducer, useRef, useState } from 'react'
import Home from './views/Home'
import axios from 'axios'

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

function App() {
    const [allMovies, setAllMovies] = useState([])
    const randomFeatureMovie = featuredMovies[Math.floor(Math.random() * featuredMovies.length)]
    const featureMovie = allMovies
                            .filter(movie => movie.uid === randomFeatureMovie.uid)
                            .map(movie => ({ ...movie, ...randomFeatureMovie}))[0]

    useEffect(() => {
        const url = '/data/movies.json'
        axios.get(url)
            .then(response => {
                if (response.data) {
                    setAllMovies(response.data.items)
                }
            })
            .catch(e => console.log(e))
    }, [])

    if (allMovies.length === 0) {
        return null
    }

    console.log('App.js render')
    return (
        <Home allMovies={allMovies} feature={featureMovie} />
    )
}

export default App
