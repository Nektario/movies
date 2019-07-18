import React, { useState, useRef, useEffect } from 'react'
import Button from '../components/Button'
import * as config from '../config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPlus, faVolumeMute, faVolumeUp, faRedoAlt } from '@fortawesome/free-solid-svg-icons'
import './VideoPlayer.scss'

const BACKDROP_URL = config.BACKDROP_URL

function VideoPlayer({ movie, autoplay = true, loop = false }) {
    const AUTOPLAY_DELAY_MILLIS = 3000
    const [isMuted, setIsMuted] = useState(true)
    const [isVideoVisible, setIsVideoVisible] = useState(false)
    const [isVideoEnded, setIsVideoEnded] = useState(false)
    const videoRef = useRef()
    
    function togglePlayState(e) {
        e.stopPropagation()

        videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause()
    }

    function handleVideoVolumeClick(e) {
        e.stopPropagation()

        if (isMuted) {
            setIsMuted(false)
            videoRef.current.muted = false
        } else {
            setIsMuted(true)
            videoRef.current.muted = true
        }
    }

    function handleVideoReplayClick(e) {
        setIsVideoEnded(false)
        setIsVideoVisible(true)
        togglePlayState(e)
    }

    function handleVideoEnded() {
        if (!loop) {
            setIsVideoVisible(false)
            setIsVideoEnded(true)
        }   
    }

    useEffect(() => {
        if (autoplay) {
            setTimeout(() => {
                setIsVideoVisible(true)
                videoRef.current.play()
                //videoRef.current.currentTime = 90
            }, AUTOPLAY_DELAY_MILLIS)
        }
    }, [autoplay])

    return (
        <div onClick={togglePlayState}>
            <video
                className='video'
                loop={loop}
                muted={isMuted}
                ref={videoRef}
                onEnded={handleVideoEnded}
            >
                <source src={`/media/${movie.featureTrailer.name}`} type={movie.featureTrailer.mimeType} />
            </video>

            <div className='video-overlay no-select'>
                
                <div className='controls-left no-select stack'>
                    <div className='title'>
                        <img src={`/media/${movie.featureLogo}`} />
                    </div>
                    
                    <div className='action-buttons'>
                        <Button>
                            <FontAwesomeIcon icon={faPlay} />
                            <span>Play</span>
                        </Button>

                        <Button>
                            <FontAwesomeIcon icon={faPlus} />
                            <span>My List</span>
                        </Button>
                    </div>

                    <div className={`info ${isVideoVisible ? 'hidden' : ''}`}>
                        <div className='tagline'>{movie.tagline}</div>
                    </div>
                </div>

                <div className='controls-right no-select'>
                    <FontAwesomeIcon
                        className={`icon ${isVideoVisible ? '' : 'hidden-icon'}`}
                        fixedWidth
                        icon={isMuted ? faVolumeMute : faVolumeUp}
                        onClick={handleVideoVolumeClick}
                    />

                    <FontAwesomeIcon
                        className={`icon ${isVideoEnded ? '' : 'hidden-icon'}`}
                        fixedWidth
                        icon={faRedoAlt}
                        onClick={handleVideoReplayClick}
                    />
                    
                    <div className='rating-bar'>
                        { movie.rated }
                    </div>
                </div>
            </div>

            <div className={`video-poster ${isVideoVisible ? 'hidden' : ''}`}>
                <img src={`${BACKDROP_URL}${movie.backdrop_path}`} />
            </div>

        </div>
    )
}

export default VideoPlayer