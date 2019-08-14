import React from 'react'
import PlayButton from './PlayButton'
import MyListButton from './MyListButton'
import './ActionButtons.scss'

function ActionButtons({ playKind, myListKind, movie }) {
    return (
        <div className='action-buttons'>
            <PlayButton kind={playKind} movie={movie} />
            <MyListButton kind={myListKind} movie={movie} />
        </div>
    )
}

export default ActionButtons