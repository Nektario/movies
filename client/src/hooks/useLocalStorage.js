import React from 'react'

function useLocalStorage(key, initialState = undefined) {
    const [state, setState] = React.useState(getFromLocalStorage(key) === undefined 
                                                ? initialState
                                                : getFromLocalStorage(key)
                                            )
    
    React.useEffect(() => {
        saveToLocalStorage(key, state)
    })

    return [state, setState]
}

function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function getFromLocalStorage(key) {
    const value = localStorage.getItem(key)

    if (value === null || value === undefined) {
        return undefined
    }

    try {
        return JSON.parse(value)
    } catch (e) {
        return undefined
    }
}

export default useLocalStorage
