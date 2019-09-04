import React, { useEffect, useRef, useState } from 'react'
import { MyListProvider } from './my-list-context'
import featuredMovies from './data/feature-movies'
import Home from './views/Home'
import axios from 'axios'

function App() {
    const [allMovies, setAllMovies] = useState([])
    const randomFeatureMovie = featuredMovies[Math.floor(Math.random() * featuredMovies.length)]
    const featureMovie = useRef()
    if (!featureMovie.current) {
        featureMovie.current = allMovies
                .filter(movie => movie.uid === randomFeatureMovie.uid)
                .map(movie => ({ ...movie, ...randomFeatureMovie}))[0]
    }

    useEffect(() => {
        axios.get('/data/movies.json')
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

    return (
        <MyListProvider>
            <Home allMovies={allMovies} feature={featureMovie.current} />
        </MyListProvider>
    )
}

export default App
