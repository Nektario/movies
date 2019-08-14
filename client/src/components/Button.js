import React from 'react'
import './Button.scss'


function Button(props) {
    const { type, kind, isLoading, onClick, children, disabled, className, ...rest } = props

    let classes = 'btn'
    
    if (kind === 'text') {
        classes += ' btn-text'
    } else if (kind === 'outlined') {
        classes += ' btn-outlined'
    } else {
        classes += ' btn-contained'
    }

    if (isLoading) {
        classes += ' btn-disabled'
    }

    if (disabled) {
        classes += ' btn-disabled'
    }

    if (className) {
        classes += ' ' + className
    }

    function handleOnClick(event) {
        event.stopPropagation()
        onClick && onClick(event)
    }

    return (
        <button type={type} disabled={isLoading || disabled} className={classes} onClick={e => handleOnClick(e)} {...rest}>
            {children}
            
            {isLoading && 
                <div className='progress'>
                    <div className="indeterminate"></div>
                </div>
            }
        </button>
    )
}

export default Button