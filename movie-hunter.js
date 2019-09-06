/* Download movie data from the TMDB api and output it to stdout */

const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()

const TMDB_API_KEY = process.env.TMDB_API_KEY
const MOVIE_DISCOVER_NUM_PAGES = 40
const MOVIE_DISCOVER_DELAY_BETWEEN_PAGES = 5000
const MOVIE_DETAILS_NUM_MOVIES_BEFORE_DELAY = 20
const MOVIE_DETAILS_DELAY = 5000

function getPopularMovies() {
    return new Promise(async resolve => {
        const unwantedMovieIds = [537915, 332562, 454983, 487558, 514999, 805, 420818]
        const baseUrl = 'https://api.themoviedb.org/3/discover/movie?'
        const searchParams = {
            api_key: TMDB_API_KEY,
            include_adult: 'false',
            include_video: 'false',
            language: 'en-US',
            'release_date.gte': '2018-01-01',
            sort_by: 'popularity.desc',
            'vote_count.gte': 500,
            with_original_language: 'en'
        }
        const urlParams = new URLSearchParams(Object.entries(searchParams))
        const movieDiscoverUrl = baseUrl + urlParams.toString()
    
        // These are some movies that we want to include even if they aren't returned by our API search
        const popularMovieIds = new Set([401981, 383498, 284053, 458156])

        let page = 0
        while (page <= MOVIE_DISCOVER_NUM_PAGES) {
            page++
    
            if (page > 1) {
                await sleep(MOVIE_DISCOVER_DELAY_BETWEEN_PAGES)
            }
            
            try {
                const response = await axios.get(movieDiscoverUrl + '&page=' + page)
                const resultMovies = response.data.results
    
                for (const movie of resultMovies) {
                    if (!unwantedMovieIds.includes(movie.id)) {
                        popularMovieIds.add(movie.id)
                    }
                }
            } catch (e) {
                console.error('Failed to get popular movies from page', page, ':', e)
            } 
        }

        resolve(popularMovieIds)
    }) 
}

function getMovieDetails(movieIds) {
    return new Promise(async resolve => {
        const baseUrl = 'https://api.themoviedb.org/3/movie'
        const searchParams = {
            api_key: TMDB_API_KEY,
            language: 'en-US',
            include_image_language: 'en,null',
            append_to_response: 'videos,images,credits,release_dates',
        }
        const urlParams = new URLSearchParams(Object.entries(searchParams))
        const movies = []

        for (const movieId of movieIds) {
            if (movies.length % MOVIE_DETAILS_NUM_MOVIES_BEFORE_DELAY === 0) {
                await sleep(MOVIE_DETAILS_DELAY)
            }
    
            try {
                const movieDetails = await axios.get(`${baseUrl}/${movieId}?${urlParams.toString()}`)
                movies.push(parseMovie(movieDetails.data))
            } catch (e) {
                console.error('Failed to get movie details for movie id:', movieId, ':', e)
            }
        }
    
        resolve({
            count: movies.length,
            items: movies
        })
    })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function parseMovie(movieData) {
    // Images & Videos
    const backdrops = movieData.images.backdrops.slice(0, 5).map(img => img.file_path) 
    const posters = movieData.images.posters.slice(0, 5).map(img => img.file_path)
    const cast = movieData.credits.cast.slice(0, 5).map(item => ({ profile_path: item.profile_path, character: item.character, name: item.name })) 
    const crew = movieData.credits.crew
        .slice(0, 5)
        .filter(item => 
            item.job.toLowerCase().indexOf('producer') >= 0 ||
            item.job.toLowerCase().indexOf('director') >= 0 ||
            item.job.toLowerCase().indexOf('screenplay') >= 0
        )
        .map(item => ({ profile_path: item.profile_path, job: item.job, name: item.name })) 

    movieData.images.posters = posters
    movieData.poster = posters[0] ? posters[0].file_path : ''
    movieData.images.backdrops = backdrops
    movieData.backdrop = backdrops[0] ? backdrops[0].file_path : ''
    movieData.credits.cast = cast
    movieData.credits.crew = crew

    movieData.videos = movieData.videos.results.filter(video => video.name.toLowerCase().includes('trailer'))

    // Genres
    movieData.genres = movieData.genres.map(genre => genre.name)

    // Rating
    const r = movieData.release_dates.results
    let ratings = r.filter(rd => rd.iso_3166_1 === 'US')[0]
    if (!ratings) {
        ratings = r[0]
    }
    ratings = ratings.release_dates
    let rating = ratings.filter(rd => rd.iso_639_1 === 'en')[0]
    if (!rating) {
        rating = ratings[0]
    }

    movieData.rated = rating.certification
    movieData.uid = ''+movieData.id

    // Extra stuff that we don't need
    delete movieData.adult
    delete movieData.spoken_languages
    delete movieData.video
    delete movieData.videos.results
    delete movieData.release_dates

    return movieData
}

return Promise.resolve()
        .then(getPopularMovies)
        .then(getMovieDetails)
        //.then(movies => console.log(JSON.stringify(movies, null, 2)))
        .then(movies => console.log(JSON.stringify(movies)))
        .catch(console.log)