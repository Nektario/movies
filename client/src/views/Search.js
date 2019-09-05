import React from 'react'
import RowView from './RowView'
import './Search.scss'

function Search(props) {
    const [searchResults, setSearchResults] = React.useState()
    const searchText = props.location.search.replace('?','')

    React.useEffect(function performSearch() {
        const results = props.allMovies
                            .filter(movie => movie.title.toLowerCase().includes(searchText))
                            .sort((a,b) => a.title.localeCompare(b.title))

        setSearchResults({ title: 'Search Results', movies: results })
    }, [props.allMovies, searchText])

    return (
        <div>
            <h2>Search results for: { props.location.search.replace('?','') }</h2>
            { searchResults && searchResults.movies.length && <RowView row={searchResults} showRowHeader={false} /> }
        </div>
    )
}

export default Search