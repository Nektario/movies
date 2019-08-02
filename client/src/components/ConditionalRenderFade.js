import React from 'react'
import ConditionalRender from './ConditionalRender'

function ConditionalRenderFade({ children, shouldShow, ...rest }) {
    return (
        <ConditionalRender {...rest} toggle={shouldShow} transitions={{
            from: { opacity: 0 },
            enter: { opacity: 1 },
            leave: { opacity: 0 }
        }}>
            { children }
        </ConditionalRender>
    )

    
}

export default ConditionalRenderFade