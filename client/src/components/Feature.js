import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPlus} from '@fortawesome/free-solid-svg-icons'
import Button from './Button'
import VideoPlayer from './VideoPlayer'
import VideoReplayButton from './VideoReplayButton'
import Backdrop from './Backdrop'
import MovieLogo from './MovieLogo'
import RatedBar from './RatedBar'
import Transition from './Transition'
import ConditionalRenderFade from './ConditionalRenderFade'
import * as config from '../config'
import './Feature.scss'

const PLAY_VIDEO_DELAY_MILLIS = 3000

function Feature(props) {
    const [showPoster, setShowPoster] = useState(true)
    const [showInfo, setShowInfo] = useState(true)
    const [showReplayButton, setShowReplayButton] = useState(false)

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

                    <Button>
                        <FontAwesomeIcon icon={faPlus} className='button-icon' />
                        <span>My List</span>
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
            <Transition showFirstChild={showPoster}>
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
            </Transition>
        </div>
    )
}

export default Feature