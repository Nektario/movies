import React, { useState, useEffect, useContext } from 'react'
import MyListContext from '../MyListContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPlus, faCheck } from '@fortawesome/free-solid-svg-icons'
import Button from './Button'
import VideoPlayer from './VideoPlayer'
import VideoReplayButton from './VideoReplayButton'
import Backdrop from './Backdrop'
import MovieLogo from './MovieLogo'
import RatedBar from './RatedBar'
import CrossfadeChildren from './animations/CrossfadeChildren'
import AnimateChildren from './animations/AnimateChildren'
import ConditionalRenderFade from './ConditionalRenderFade'
import * as config from '../config'
import './Feature.scss'

const PLAY_VIDEO_DELAY_MILLIS = 3000

function Feature(props) {
    const [showPoster, setShowPoster] = useState(true)
    const [showInfo, setShowInfo] = useState(true)
    const [showReplayButton, setShowReplayButton] = useState(false)
    const myList = useContext(MyListContext)

    useEffect(() => {
        setTimeout(() => {
            setShowInfo(false)
            setShowPoster(false)
        }, PLAY_VIDEO_DELAY_MILLIS)
    }, [])

    function handleVideoEnded() {
        setShowInfo(true)
        setShowPoster(true)
        setShowReplayButton(true)
    }

    function handleOnVideoPlayed() {
        setShowInfo(false)
        setShowPoster(false)
        setShowReplayButton(false)
    }

    function handleMyListClick(movie) {
        myList.update(movie)
    }

    return (
        <div className='feature'>
            <div className='feature-overlay-left stack'>
                <div className='feature-logo'>
                    <MovieLogo src={props.movie.featureLogo} />
                </div>
                
                <div className='feature-buttons'>
                    <Button>
                        <FontAwesomeIcon icon={faPlay} className='button-icon' />
                        <span>Play</span>
                    </Button>

                    <Button onClick={() => handleMyListClick(props.movie)}>
                        <AnimateChildren toggle={myList.has(props.movie)} transitions={{
                            from: { opacity: 1, transform: 'scale(1)' },
                            enter: { opacity: 1, transform: 'scale(1)' },
                            leave: { opacity: 0, transform: 'scale(1.6)' },
                        }
                        }>
                            <FontAwesomeIcon icon={faCheck} className='button-icon my-list-icon' fixedWidth />
                            <FontAwesomeIcon icon={faPlus} className='button-icon my-list-icon' fixedWidth />
                        </AnimateChildren>
                        <span className='my-list-text'>My List</span>
                    </Button>
                </div>

                <div className='feature-info'>
                    <ConditionalRenderFade shouldShow={showInfo}>
                        <div className='tagline'>{props.movie.tagline}</div>
                    </ConditionalRenderFade>
                </div>
            </div>

            <div className='feature-overlay-right-rated'>
                <RatedBar rated={props.movie.rated} />
            </div>

            <div className='feature-overlay-right-replay-button'>
                <ConditionalRenderFade shouldShow={showReplayButton}>
                    <VideoReplayButton onClick={() => setShowPoster(false)} />
                </ConditionalRenderFade>
            </div>

            {/* These are absolutely positioned */}
            <CrossfadeChildren toggle={showPoster}>
                <Backdrop
                    src={props.movie.backdrop_path}
                    className='feature-poster'
                />

                <VideoPlayer
                    className='feature-video'
                    shouldPlay={!showPoster}
                    showRatedBar={false}
                    onVideoEnded={handleVideoEnded}
                    onVideoPlayed={handleOnVideoPlayed}
                    loop={false}
                    path={config.FEATURE_VIDEO_URL + '/' + props.movie.featureTrailer.name}
                    mimeType={props.movie.featureTrailer.mimeType}
                />
            </CrossfadeChildren>
        </div>
    )
}



export default Feature