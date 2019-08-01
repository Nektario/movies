import React from 'react'
import { useTransition, animated, config } from 'react-spring'

function ConditionalRender(props) {
    const transitionStyle = props.transitions
    const key = props.key
    
    if (props.behavior === 'molasses') transitionStyle.config = config.molasses
    else if (props.behavior === 'slow') transitionStyle.config = config.slow
    else if (props.behavior === 'stiff') transitionStyle.config = config.stiff
    else if (props.behavior === 'wobbly') transitionStyle.config = config.wobbly
    else if (props.behavior === 'gentle') transitionStyle.config = config.gentle
    else if (props.behavior === 'fast') transitionStyle.config = { duration: 100 }
    else transitionStyle.config = config.default
    
    const transitions = useTransition(props.shouldShow, null, transitionStyle)

    return transitions.map(({ item: shouldShow, props: styleProps }) => 
        shouldShow && <animated.div className={props.className} style={styleProps} key={key || 0}>{ props.children }</animated.div>
    )
}

export default ConditionalRender