/* MyList structure: [{ uid: "383498", dateAdded: 1567604127095 }] */

import React from 'react'
import usePersistentReducer from './hooks/usePersistentReducer'

const MY_LIST_STORAGE_KEY = 'my-list'
const MyListStateContext = React.createContext()
const MyListDispatchContext = React.createContext()
const MyListHelperContext = React.createContext()

function reducer(state, action) {
    switch (action.type) {
        case 'set':
            return action.data
        case 'toggle':
            return toggleMyListItem(state, action.data)
        default: {
            throw new Error(`bookmark-context: Unhandled action type: ${action.type}`)
        }
    }
}

function toggleMyListItem(myList, movie) {
    let newList

    if (isMovieInMyList(myList, movie)) {
        newList = myList.filter(myListMovie => myListMovie.uid !== movie.uid)
    } else {
        newList = [{ uid: movie.uid, dateAdded: Date.now() }].concat(myList)
    }

    return newList
}

function isMovieInMyList(myList, movie) {
    if (movie) {
        return myList.some(myListMovie => myListMovie.uid === movie.uid)
    }

    return false
}

function MyListProvider({ children }) {
    const [state, dispatch] = usePersistentReducer(MY_LIST_STORAGE_KEY, reducer, [])

    const myListHelper = {
        isInMyList: (movie) => isMovieInMyList(state, movie)
    }

    return (
        <MyListStateContext.Provider value={state}>
            <MyListDispatchContext.Provider value={dispatch}>
                <MyListHelperContext.Provider value={myListHelper}>
                    {children}
                </MyListHelperContext.Provider>
            </MyListDispatchContext.Provider>
        </MyListStateContext.Provider>
    )
}

function useMyListState() {
    const context = React.useContext(MyListStateContext)

    if (context === undefined) {
        throw new Error('useMyListState must be used within a MyListStateContext provider')
    }
    return context
}

function useMyListDispatch() {
    const context = React.useContext(MyListDispatchContext)

    if (context === undefined) {
        throw new Error('useMyListDispatch must be used within a MyListDispatchContext provider')
    }

    return context
}

function useMyListHelper() {
    const context = React.useContext(MyListHelperContext)

    if (context === undefined) {
        throw new Error('useMyListHelper must be used within a MyListHelperContext provider')
    }

    return context
}

export { MyListProvider, useMyListState, useMyListDispatch, useMyListHelper }