import React from 'react'
import { useTransition, animated, config } from 'react-spring'

function ConditionalRender(props) {
    const transitionStyle = props.transitions
    
    if (props.behavior === 'molasses') transitionStyle.config = config.molasses
    else if (props.behavior === 'slow') transitionStyle.config = config.slow
    else if (props.behavior === 'stiff') transitionStyle.config = config.stiff
    else if (props.behavior === 'wobbly') transitionStyle.config = config.wobbly
    else if (props.behavior === 'gentle') transitionStyle.config = config.gentle
    else transitionStyle.config = config.default

    const transitions = useTransition(props.shouldShow, null, transitionStyle)

    return transitions.map(({ item: shouldShow, props: styleProps }) => 
        shouldShow && <animated.div style={styleProps} key={props.key || 0}>{ props.children }</animated.div>
    )
}

export default ConditionalRender