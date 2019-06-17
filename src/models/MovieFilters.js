function MovieFilters() {
    let movieFilters = []
    
    return {
        add: function(item) {
            if (!this.has(item)) {
                if (item.type === 'filter-seen') {
                    movieFilters.push(SeenFilter(item.payload))
                }
            }
        },
        remove: function(item) {
            movieFilters = movieFilters.filter(movieFilter => item.type !== movieFilter.type || item.payload !== movieFilter.payload)
        },
        has: function(item) {
            return movieFilters.filter(movieFilter => item.type == movieFilter.type && item.payload == movieFilter.payload).length > 0
        },
        applyFilter: function(allMovies) {
            // display the movie only if every filter returns true
            return allMovies.filter(movie => {
                return movieFilters.every(movieFilter => {
                    return movieFilter.shouldKeep(movie)
                })
            })
        }
    }
}

function SeenFilter(user) {
    return {
        type: 'filter-seen',
        payload: user,
        shouldKeep: function(movie) {
            return !(movie.metadata.hasOwnProperty('seen') && movie.metadata.seen.includes(user))
        }
    }
}

export default MovieFilters