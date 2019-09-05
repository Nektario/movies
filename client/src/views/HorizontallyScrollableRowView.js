import React from 'react'
import MovieSliderRow from '../components/MovieSliderRow'

function HorizontallyScrollableRowView({ rows, showRowHeader = true }) {
    const [currentlyOpenedMovieDetailsRow, setCurrentlyOpenedMovieDetailsRow] = React.useState()

    function toggleMovieDetailsVisibility(titleOfClickedRow) {
        if (titleOfClickedRow === currentlyOpenedMovieDetailsRow) {
            setCurrentlyOpenedMovieDetailsRow('')
        } else {
            setCurrentlyOpenedMovieDetailsRow(titleOfClickedRow)
        }
    }

    return (
        rows.map(row => 
            <MovieSliderRow
                key={row.title}
                rowTitle={row.title}
                onMovieDetailsClick={(title) => toggleMovieDetailsVisibility(title)}
                shouldOpen={currentlyOpenedMovieDetailsRow === row.title}
                movies={row.movies}
                showRowHeader={showRowHeader}
            />)
    )
}

export default HorizontallyScrollableRowView