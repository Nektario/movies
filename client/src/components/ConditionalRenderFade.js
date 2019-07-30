import React from 'react'
import ConditionalRender from './ConditionalRender'

function ConditionalRenderFade(props) {
    return (
        <ConditionalRender {...props} transitions={{
            from: { opacity: 0 },
            enter: { opacity: 1 },
            leave: { opacity: 0 },
            trail: '5000'
        }}>
            { props.children }
        </ConditionalRender>
    )

    
}

export default ConditionalRenderFade