import React from 'react'
import * as config from '../config'

function Backdrop({ src, className, alt, ...rest}) {
    const url = config.BACKDROP_URL + src
    
    return (
        <div className={'backdrop ' + className}>
            <img src={url} alt={alt ? alt : 'backdrop'} {...rest} />
        </div>
    )
}

export default Backdrop