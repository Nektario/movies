import React from 'react'
import { useTransition, animated, config } from 'react-spring'

function CrossfadeItems(props) {
    const transitions = useTransition(props.item, item => item.uid, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: { mass: 1, tension: 280, friction: 80 }
    })

    return transitions.map(({ item, props: transitionProps, key }) => (
        <animated.div className={props.className} key={key} style={transitionProps}>
            { props.render({ item }) }
        </animated.div>
    ))
}

export default CrossfadeItems