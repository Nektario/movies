import React, { useState, useRef, useEffect } from 'react'
import Transition from './Transition'
import VideoReplayButton from './VideoReplayButton'
import RatedBar from './RatedBar'
import VideoVolumeButton from './VideoVolumeButton'
import './VideoPlayer.scss'

function VideoPlayer({ className, path, mimeType, shouldPlay, loop = false, onVideoPlayed, onVideoEnded, showRatedBar = true, movieRated }) {
    const [isMuted, setIsMuted] = useState(true)
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
        togglePlayState(e)
    }

    function handleVideoEnded() {
        if (typeof onVideoEnded === 'function') {
            onVideoEnded()
        }

        if (!loop) {
            setIsVideoEnded(true)
        }   
    }

    function handleVideoPlayed() {
        if (typeof onVideoPlayed === 'function') {
            onVideoPlayed()
        }
    }

    useEffect(() => {
        if (shouldPlay) {
            videoRef.current.play()
        }
    }, [shouldPlay])

    
    return (
        <div className='video-player' onClick={togglePlayState}>
            <video
                className={'video ' + className}
                loop={loop}
                muted={isMuted}
                ref={videoRef}
                onEnded={handleVideoEnded}
                onPlay={handleVideoPlayed}
            >
                <source src={path} type={mimeType} />
            </video>

            {/* This is absolutely positioned */}
            { showRatedBar &&
                <div className='video-rated-bar'>
                    <RatedBar rated={movieRated} />
                </div>
            }
            
            {/* This is absolutely positioned */}
            <div className='video-controls'>
                <Transition speed='fast' showFirstChild={!isVideoEnded}>
                    <VideoVolumeButton isMuted={isMuted} onClick={handleVideoVolumeClick} />
                    <VideoReplayButton onClick={handleVideoReplayClick} />
                </Transition>
            </div>
        </div>
    )
}

export default VideoPlayer