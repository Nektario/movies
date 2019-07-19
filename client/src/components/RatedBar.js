import React from 'react'
import './RatedBar.scss'

function RatedBar({ rated }) {
    return (
        <div className='rated-bar'>
            { rated }
        </div>
    )
}

export default RatedBar