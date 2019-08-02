import { useState, useEffect, useRef } from 'react'

function usePersistentState(key, initialState = undefined) {
    const valueInLocalStorage = useRef()
    valueInLocalStorage.current = getFromLocalStorage(key)
    const [state, setState] = useState(valueInLocalStorage.current !== undefined ? valueInLocalStorage.current : initialState)
    
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

    if (value === null || value === undefined) {
        return undefined
    }

    try {
        return JSON.parse(value)
    } catch (e) {
        return undefined
    }
}

export default usePersistentState
