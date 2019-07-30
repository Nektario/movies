import React from 'react'
import ConditionalRender from './ConditionalRender'

function ConditionalRenderHeight(props) {
    return (
        <ConditionalRender shouldShow={props.shouldShow} transitions={{
            from: { height: '0vw' },
            enter: { height: props.height },
            leave: { height: '0vw' }
        }}>
            { props.children }
        </ConditionalRender>
    )
}

export default ConditionalRenderHeight