import React, { useContext } from 'react'
import MyListContext from '../MyListContext'
import Button from './Button'
import AnimateChildren from './animations/AnimateChildren'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCheck } from '@fortawesome/free-solid-svg-icons'

function MyListButton(props) {
    const myList = useContext(MyListContext)
    const isInMyList = myList.has(props.movie)

    // checkmark needs to rotate 360degrees
    const iconRotation = isInMyList ? 'rotate(360deg)' : 'rotate(180deg)'
    const iconPosition = {
        left: '1.6vw',
        position: 'absolute'
    }

    return (
        <Button className='my-list-button' kind={props.kind} onClick={() => myList.update(props.movie)}>
            <AnimateChildren toggle={isInMyList} transitions={{
                initial: null,
                from:  { opacity: 1, transform: 'rotate(0deg)', ...iconPosition },
                enter: { opacity: 1, transform: iconRotation, ...iconPosition },
                leave: { opacity: 0, transform: iconRotation, ...iconPosition }
            }
            }>
                <FontAwesomeIcon icon={faCheck} fixedWidth />
                <FontAwesomeIcon icon={faPlus} fixedWidth />
            </AnimateChildren>
            <span className='my-list-text'>My List</span>
        </Button>
    )
}

export default MyListButton