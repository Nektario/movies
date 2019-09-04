/* Download movie data from the TMDB api */

const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()

const MOVIE_DISCOVER_NUM_PAGES = 20
const MOVIE_DISCOVER_DELAY_BETWEEN_PAGES = 5000
const MOVIE_DETAILS_NUM_MOVIES_BEFORE_DELAY = 20
const MOVIE_DETAILS_DELAY = 5000

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_DISCOVER_MOVIE_BASE_URL = 'https://api.themoviedb.org/3/discover/movie?'
const movieDiscoverParams = {
    api_key: TMDB_API_KEY,
    include_adult: 'false',
    include_video: 'false',
    language: 'en-US',
    'release_date.gte': '2018-01-01',
    sort_by: 'popularity.desc',
    'vote_count.gte': 500,
    with_original_language: 'en'
}
const movieDiscoverUrlParams = new URLSearchParams(Object.entries(movieDiscoverParams))
const movieDiscoverUrl = TMDB_DISCOVER_MOVIE_BASE_URL + movieDiscoverUrlParams.toString()

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function execute() {
    let page = 0

    // These are some movies that we want to include even if they aren't returned by our API search
    const popularMovies = new Set([401981, 383498, 284053, 458156])
    while (page <= MOVIE_DISCOVER_NUM_PAGES) {
        page++

        if (page > 1) {
            await sleep(MOVIE_DISCOVER_DELAY_BETWEEN_PAGES)
        }
        
        try {
            const response = await axios.get(movieDiscoverUrl + '&page=' + page)
            const resultMovies = response.data.results

            for (const movie of resultMovies) {
                popularMovies.add(movie.id)
            }
        } catch (e) {
            console.log('Failed to get movieList', e)
        } 
    }

    // remove some movies that we don't want
    popularMovies.delete(537915)
    popularMovies.delete(332562)
    popularMovies.delete(454983)
    popularMovies.delete(487558)
    popularMovies.delete(514999)
    
    // get movie details for each of the discovered movies
    const movies = []
    for (const movie of popularMovies) {
        if (movies.length % MOVIE_DETAILS_NUM_MOVIES_BEFORE_DELAY === 0) {
            await sleep(MOVIE_DETAILS_DELAY)
        }

        try {
            const movieDetails = await getMovieDetails(movie)
            movies.push(parseMovie(movieDetails.data))
        } catch (e) {
            console.error('Failed to get movie details', e)
        }
    }

    const result = {
        count: movies.length,
        items: movies
    }

    console.log(JSON.stringify(result, null, 2))
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


function getMovieDetails(movieId) {
    const urlStart = 'https://api.themoviedb.org/3/movie/'
    const urlEnd = '?language=en-US&include_image_language=en,null&append_to_response=videos,images,credits,release_dates&api_key=' + API_KEY

    const theUrl = `${urlStart}${movieId}${urlEnd}`
    return axios.get(theUrl)
}

execute()