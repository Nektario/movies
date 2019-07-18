import React from 'react'
import './Header.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSortAlphaUp, faSortAlphaDownAlt as faSortAlphaDown, faMale, faFemale, faBaby } from '@fortawesome/free-solid-svg-icons'
import { faClock, faStar, faCalendarAlt as faCalendar } from '@fortawesome/free-regular-svg-icons'


function Header(props) {
    const filters = [
        {
            id: 'filter-seen',
            data: 'user1',
            text: 'Filter: Not seen by Nek',
            icon: faMale,
        },
        {
            id: 'filter-seen',
            data: 'user2',
            text: 'Filter: Not seen by Joaly',
            icon: faFemale,
        },
        {
            id: 'filter-seen',
            data: 'user3',
            text: 'Filter: Not seen by Derek',
            icon: faBaby,
        }
    ]

    const sorts = [
        {
            id: 'sort-title-asc',
            text: 'Sort: Title Ascending',
            icon: faSortAlphaUp,
        },
        {
            id: 'sort-title-desc',
            text: 'Sort: Title Descending',
            icon: faSortAlphaDown,
        },
        {
            id: 'sort-date-added',
            text: 'Sort: Date Added',
            icon: faClock,
        },
        {
            id: 'sort-release-year',
            text: 'Sort: Release Year',
            icon: faCalendar,
        },
        {
            id: 'sort-imdb-rating',
            text: 'Sort: IMDB Rating',
            icon: faStar,
        }
    ]

    function handleIconClick(itemClicked) {
        props.dispatch({ type: itemClicked.id, payload: itemClicked.data })
    }

    // don't render this until the movies are ready to be rendered
    if (!props.totalMovies) {
        return null
    }

    return (
        <div id='header'>
            <ul>
                { filters.map(filterItem => {
                    return (
                        <li key={filterItem.id + '_' + filterItem.data}>
                            {/* <FontAwesomeIcon icon={filterItem.icon} className={`icon ${props.currentFilter.includes(filterItem.id) && 'icon-active'}`}  */}
                            <FontAwesomeIcon icon={filterItem.icon} className='icon'
                                onClick={() => handleIconClick(filterItem)}
                            />    
                        </li>
                    )
                })}

                <li className='icon-spacer'> - </li>
                
                { sorts.map(sortItem => {
                    return (
                        <li key={sortItem.id}>
                            {/* <FontAwesomeIcon icon={sortItem.icon} className={`icon ${props.currentSort.includes(sortItem.id) && 'icon-active'}`} */}
                            <FontAwesomeIcon icon={sortItem.icon} className='icon'
                                onClick={() => handleIconClick(sortItem)}
                            />    
                        </li>
                    )
                })}
            </ul>

            {/* { i > 0 && actions[i - 1].type !== action.type && <div className='icon-spacer'> - </div> } */}
            {props.displayedMovies} / {props.totalMovies}
        </div>
    )
}

export default Header