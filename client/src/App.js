import React, { useEffect, useRef, useState } from 'react'
import { MyListProvider } from './MyListContext'
import usePersistentState from './hooks/usePersistentState'
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
    const [myList, setMyList] = usePersistentState(useState([]))
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
        for (const myListMovie of myList) {
            if (myListMovie.uid === movie.uid) {
                return true
            }
        }
        return false
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
