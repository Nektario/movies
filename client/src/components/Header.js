import React from 'react'
import './Header.scss'

function Header() {
    return (
        <div className='header'>
            <div className='top-scrim'></div>

            <div className='header-content'>
                <div className='logo'>
                    MOVIES
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="120 -10 512 512" width="32">
                        <path fill="#fff" d="M361.5 239.2L173.9 108.6c-9.5-7.3-30.8-4.8-32.1 16.8v261.2c1.5 23.3 24 23.3 32.1 16.8l187.6-130.6c8.1-5.3 15.7-20.9 0-33.6zM182.6 347.5v-183L314.1 256l-131.5 91.5z"/>
                    </svg>
                </div>
                <div className='header-text-item'>Home</div>
                <div className='header-text-item'>Top Rated</div>
                <div className='header-text-item'>Recently Added</div>
                <div className='header-text-item'>My List</div>
            </div>
        </div>
    )
}

export default  Header