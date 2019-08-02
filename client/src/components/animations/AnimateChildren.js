import React from 'react'
import { useTransition, animated, config } from 'react-spring'

function AnimateChildren(props) {
    const transitions = useTransition(props.toggle, null, props.transitions)
        
    return transitions.map(({ item: toggle, props: styleProps }) => 
        toggle
            ? <animated.div style={styleProps} key={'animateChildren-0' + Math.random()}>{ props.children[0] }</animated.div>
            : <animated.div style={styleProps} key={'animateChildren-1' + Math.random()}>{ props.children[1] }</animated.div>
    )
}

export default AnimateChildren