import React, { useEffect, useRef, useState } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { MyListProvider } from './my-list-context'
import featuredMovies from './data/feature-movies'
import Header from './components/Header'
import Home from './views/Home'
import Search from './views/Search'
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
            <Router>
                <Header />
                <Switch>
                    <Route path='/home' render={props => <Home {...props} allMovies={allMovies} feature={featureMovie.current} />} />
                    <Route path='/search' component={Search} />
                    <Route render={() => <Redirect to='/home' />} />
                </Switch>
            </Router>
        </MyListProvider>
    )
}

export default App
