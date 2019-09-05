import React from 'react'
import MovieSliderRow from '../components/MovieSliderRow'

/*
    This component takes in a row and displays multiple rows which are no wider than the viewport
*/
function RowView({ row, showRowHeader = true }) {
    const [currentlyOpenedMovieDetailsRow, setCurrentlyOpenedMovieDetailsRow] = React.useState()
    const [myRows, setMyRows] = React.useState([row])
    const numItemsPerRow = React.useRef()

    React.useEffect(() => {
        setMyRows(createRightSizedRows(row, numItemsPerRow.current))
    }, [row])

    function toggleMovieDetailsVisibility(titleOfClickedRow) {
        if (titleOfClickedRow === currentlyOpenedMovieDetailsRow) {
            setCurrentlyOpenedMovieDetailsRow('')
        } else {
            setCurrentlyOpenedMovieDetailsRow(titleOfClickedRow)
        }
    }

    function handleOnMeasure(measurements) {
        if (measurements.numItemsPerPage > 0 && measurements.numItemsPerPage !== numItemsPerRow.current) {
            numItemsPerRow.current = measurements.numItemsPerPage
            setMyRows(createRightSizedRows(row, numItemsPerRow.current))
        }
    }

    return (
        myRows.map(row =>
            <MovieSliderRow
                key={row.title}
                rowTitle={row.title}
                onMovieDetailsClick={(title) => toggleMovieDetailsVisibility(title)}
                shouldOpen={currentlyOpenedMovieDetailsRow === row.title}
                movies={row.movies}
                showRowHeader={showRowHeader}
                onMeasure={handleOnMeasure}
            />
        )
    )
}

function createRightSizedRows(row, numItemsPerRow) {
    if (numItemsPerRow) {
        const allMovies = row.movies
        const title = row.title

        const newRows = []
        let currentRow = { movies: [] }
        let currentRowNum = 0
    
        allMovies.forEach((movie, index) => {
            if (index % numItemsPerRow === 0 && index > 1) {
                currentRow.title = title + ' ' + currentRowNum
                newRows.push(currentRow)

                currentRow = { movies: [] }
                currentRowNum++
            }
                
            currentRow.movies.push(movie)
        })
        currentRow.title = title + ' ' + currentRowNum
        newRows.push(currentRow)

        return newRows
    } else {
        return [row]
    }
}

export default RowView