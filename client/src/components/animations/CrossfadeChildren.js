import React from 'react'
import { useTransition, animated, config } from 'react-spring'

function CrossfadeChildren(props) {
    const transitions = useTransition(props.toggle, null, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: props.speed === 'fast' ? config.wobbly : config.molasses
    })

    return transitions.map(({ item: toggle, props: styleProps }) => 
        toggle
            ? <animated.div style={styleProps} key='0'>{ props.children[0] }</animated.div>
            : <animated.div style={styleProps} key='1'>{ props.children[1] }</animated.div>
    )
}

export default CrossfadeChildren