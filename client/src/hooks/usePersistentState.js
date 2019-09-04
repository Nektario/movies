import useLocalStorage from './useLocalStorage'

function usePersistentState(key, initialValue = undefined) {
    return useLocalStorage(key, initialValue)
}

export default usePersistentState
