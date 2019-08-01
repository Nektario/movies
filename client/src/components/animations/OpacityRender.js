import React from 'react'
import { useSpring, animated, config } from 'react-spring'

function OpacityRender(props) {
    const styleProps = useSpring(
        { 
            opacity: props.shouldShow ? 1 : 0,
            config: props.speed === 'fast' ? config.wobbly : config.molasses
        }
    )

    return (
        <animated.div style={styleProps} key='0'>
            {props.children}
        </animated.div>
    )
}


export default OpacityRender