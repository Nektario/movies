import React, { useEffect, useRef, useState } from 'react'
import { MyListProvider } from './MyListContext'
import usePersistentState from './hooks/usePersistentState'
import featuredMovies from './data/feature-movies'
import Home from './views/Home'
import axios from 'axios'

function App() {
    const [allMovies, setAllMovies] = useState([])
    const [myList, setMyList] = usePersistentState('my-list', [])
    const MyList = {
        list: myList,
        update: handleMyListUpdate,
        has: (movie) => isMovieInMyList(movie)
    }
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

    function handleMyListUpdate(movie) {
        let newList

        if (isMovieInMyList(movie)) {
            newList = myList.filter(myListMovie => myListMovie.uid !== movie.uid)
        } else {
            newList = [{ uid: movie.uid, dateAdded: Date.now() }].concat(myList)
        }
        
        setMyList(newList)
    }

    function isMovieInMyList(movie) {
        if (movie) {
            for (const myListMovie of myList) {
                if (myListMovie && myListMovie.uid === movie.uid) {
                    return true
                }
            }
        }
        
        return false
        //return myList.filter(myListItem => myListItem.uid === movie.uid).length > 0
    }

    if (allMovies.length === 0) {
        return null
    }

    return (
        <MyListProvider value={MyList}>
            <Home allMovies={allMovies} myList={myList} feature={featureMovie.current} />
        </MyListProvider>
    )
}

export default App
