import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { useMyListHelper } from './my-list-context'
import featuredMovies from './data/feature-movies'
import Header from './components/Header'
import Home from './views/Home'
import Search from './views/Search'
import ItemList from './views/ItemList'

function App() {
    const [allMovies, setAllMovies] = useState([])
    const myListHelper = useMyListHelper()
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
        <Router>
            <Header />
            <Switch>
                <Route path='/home' render={props => <Home {...props} allMovies={allMovies} feature={featureMovie.current} />} />
                <Route path='/my-list' render={props => <ItemList {...props} movies={allMovies.filter(movie => myListHelper.isInMyList(movie))} />} />
                <Route path='/search' render={props => <Search {...props} allMovies={allMovies} />} />
                <Route render={() => <Redirect to='/home' />} />
            </Switch>
        </Router>
    )
}

export default App
