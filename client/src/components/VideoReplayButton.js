import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons'
import './VideoPlayerIcon.scss'

function VideoReplayButton(props) {
    return (
        <div className='video-player-icon-wrapper'>
            <FontAwesomeIcon
                className='video-player-icon'
                fixedWidth
                icon={faRedoAlt}
                onClick={props.onClick}
            />
        </div>
    )
}

export default VideoReplayButton