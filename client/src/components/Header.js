import React from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as SearchToCloseIconSvg } from './searchToCloseIcon.svg'
import { animateSvgIcon } from '../util'
import { withRouter } from 'react-router-dom'
import './Header.scss'

const ICON_SIZE = 24
const ICON_NUM_FRAMES = 60
const SEARCH_TO_CLOSE_ICON_ANIMATION_DURATION_MILLIS = 550

function Header(props) {
    const [isSearchInputExpanded, setIsSearchInputExpanded] = React.useState(false)
    const [searchInputValue, setSearchInputValue] = React.useState('')
    const [viewBoxXStartPosition] = React.useState(isSearchInputExpanded ? ICON_SIZE * ICON_NUM_FRAMES : 0)
    const svgRef = React.useRef()
    const searchInputRef = React.useRef()

    React.useEffect(function clearSearchInput() {
        if (!isSearchInputExpanded) {
            setSearchInputValue('')
        }
    }, [isSearchInputExpanded])

    function toggleSearchInputDisplay() {
        animateSvgIcon(SEARCH_TO_CLOSE_ICON_ANIMATION_DURATION_MILLIS, ICON_NUM_FRAMES, !isSearchInputExpanded, svgRef.current, ICON_SIZE)
        setIsSearchInputExpanded(curr => !curr)

        if (!isSearchInputExpanded) {
            searchInputRef.current.focus()
            // This is here so that the placeholder text doesn't mix in with the search icon during..
            // ..expansion of the search bar    
            setTimeout(() => {
                searchInputRef.current.placeholder = 'Search movie title'
            }, 150)
        } else {
            searchInputRef.current.placeholder = ''

            // If the user is on a search results page and they close the search bar..
            // ..take them back to the referrer
            if (props.location.pathname === '/search') {
                const referrer = props.location.state.referrer
                setTimeout(() => {
                    if (referrer) {
                        console.log('going to referrer', referrer)
                        props.history.push(referrer)
                    } else {
                        console.log('going to /home')
                        props.history.push('/home')
                    }
                }, 450)
            }
        }

    }

    function handleSubmitSearch(e) {
        e.preventDefault()
        if (searchInputValue.length > 1) {
            props.history.push('/search?' + searchInputValue, { referrer: props.location.pathname })
        }
    }

    return (
        <div className='header'>
            <div className='top-scrim'></div>

            <div className='header-content'>
                <div className='left'>
                    <div className='logo'>
                        MOVIES
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="120 -10 512 512" width="32">
                            <path fill="#fff" d="M361.5 239.2L173.9 108.6c-9.5-7.3-30.8-4.8-32.1 16.8v261.2c1.5 23.3 24 23.3 32.1 16.8l187.6-130.6c8.1-5.3 15.7-20.9 0-33.6zM182.6 347.5v-183L314.1 256l-131.5 91.5z"/>
                        </svg>
                    </div>
                    <div className='header-text-item'><Link to='/home'>Home</Link></div>
                    <div className='header-text-item'><Link to='/my-list'>My List</Link></div>
                </div>

                <div className='right'>
                    <form className='search' onSubmit={handleSubmitSearch}>
                        <input
                            type='text'
                            value={searchInputValue}
                            onChange={e => setSearchInputValue(e.target.value)}
                            ref={searchInputRef}
                            className={`search-input ${isSearchInputExpanded && 'search-input-expanded'}`}
                        />
                        <SearchToCloseIconSvg 
                            ref={svgRef}
                            viewBox={`${viewBoxXStartPosition} 0 ${ICON_SIZE} ${ICON_SIZE}`}
                            onClick={toggleSearchInputDisplay}
                            className={`search-to-close-icon ${isSearchInputExpanded && 'search-to-close-icon-expanded'}`}
                        />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default  withRouter(Header)