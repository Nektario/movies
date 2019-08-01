import React, { useState, useRef, useEffect } from 'react'
import usePersistentState from '../hooks/usePersistentState'
import CrossfadeChildren from './animations/CrossfadeChildren'
import VideoReplayButton from './VideoReplayButton'
import RatedBar from './RatedBar'
import VideoVolumeButton from './VideoVolumeButton'
import './VideoPlayer.scss'

function VideoPlayer({ className, path, mimeType, shouldPlay, loop = false, onVideoPlayed, onVideoEnded, showRatedBar = true, movieRated }) {
    const [isMuted, setIsMuted] = usePersistentState('video_player_is_muted', true)
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
        setIsVideoEnded(false)
    }

    useEffect(() => {
        if (shouldPlay) {
            videoRef.current.play()
        }
    }, [shouldPlay])

    function randomKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    
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
                <CrossfadeChildren speed='fast' toggle={isVideoEnded}>
                <div id={randomKey()}>
                    <VideoReplayButton onClick={handleVideoReplayClick} />
                    </div>
                    <div id={randomKey()}>
                    <VideoVolumeButton isMuted={isMuted} onClick={handleVideoVolumeClick} />
                    </div>
                </CrossfadeChildren>
            </div>
        </div>
    )
}

export default VideoPlayer