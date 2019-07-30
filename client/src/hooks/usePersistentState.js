import { useState, useEffect } from 'react'

function usePersistentState(key, initialState = undefined) {
    const valueInLocalStorage = getFromLocalStorage(key)
    const [state, setState] = useState(valueInLocalStorage !== null ? valueInLocalStorage : initialState)
    
    useEffect(() => {
        saveToLocalStorage(key, state)
    })

    return [state, setState]
}

function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function getFromLocalStorage(key) {
    const value = localStorage.getItem(key)
    if (!value) {
        return null
    }

    try {
        return JSON.parse(value)
    } catch (e) {
        return null
    }
}

export default usePersistentState
