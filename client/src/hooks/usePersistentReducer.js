import React from 'react'
import useLocalStorage from './useLocalStorage'

function usePersistentReducer(key, reducer, initialState = undefined) {
    const [persistedState, setPersistedState] = useLocalStorage(key, initialState)
    const [state, dispatch] = React.useReducer(reducer, persistedState)
    
    React.useEffect(() => {
        setPersistedState(state)
    })
    
    return [state, dispatch]
}

export default usePersistentReducer
