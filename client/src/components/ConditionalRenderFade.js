import React from 'react'
import { useTransition, animated, config } from 'react-spring'

function ConditionalRenderFade(props) {
    const transitions = useTransition(props.shouldShow, null, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 }
    })

    return transitions.map(({ item: shouldShow, props: styleProps }) => 
        shouldShow && <animated.div style={styleProps} key='0'>{ props.children }</animated.div>
    )
}

export default ConditionalRenderFade