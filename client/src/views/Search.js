import React from 'react'
import { withRouter } from 'react-router-dom'
import RowView from './RowView'
import './Search.scss'

function Search(props) {
    const [searchResults, setSearchResults] = React.useState()
    const searchText = props.location.search.replace('?','')

    React.useEffect(function performSearch() {
        if (isSearchTextValid(searchText)) {
            const results = props.allMovies
                                .filter(movie => movie.title.toLowerCase().includes(searchText))
                                .sort((a,b) => a.title.localeCompare(b.title))
    
            setSearchResults({ title: 'Search Results', movies: results })
        }
    }, [props.allMovies, searchText])

    function isSearchTextValid(searchText) {
        return searchText && searchText.length > 1
    }

    if (!isSearchTextValid(searchText)) {
        props.history.push('/home')
        return null
    }

    if (!searchResults) {
        return null
    }

    if (searchResults) {
        return (
            <>
                <div className='search-header'>
                    <p>{ searchResults.movies.length } results</p>
                </div>
                <RowView row={searchResults} showRowHeader={false} />
            </>
        )
    }
}

export default withRouter(Search)