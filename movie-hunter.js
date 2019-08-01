const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()

const API_KEY = process.env.TMDB_API_KEY
const movieListUrl = 'https://api.themoviedb.org/3/discover/movie?language=en-US&with_original_language=en&sort_by=popularity.desc&include_adult=false&include_video=false&release_date.gte=2018-01-01&vote_count.gte=500&api_key=' + API_KEY

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function execute() {
    let page = 0

    const popularMovies = new Set([401981, 383498, 284053, 458156])
    while (page <= 10) {
        page++

        if (page > 1) {
            await sleep(5000)
        }
        
        try {
            const response = await axios.get(movieListUrl + '&page=' + page)
            const resultMovies = response.data.results
            for (const movie of resultMovies) {
                popularMovies.add(movie.id)
            }
        } catch (e) {
            console.log('Failed to get movieList', e)
        } 
    }

    // remove some movies that we don't want
    popularMovies.delete(537915) // After
    popularMovies.delete(332562) // A star is born
    popularMovies.delete(454983) // Kissing Booth
    popularMovies.delete(487558)

    const movies = []
    for (const movie of popularMovies) {
        if (movies.length % 20 === 0) {
            await sleep(5000)
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