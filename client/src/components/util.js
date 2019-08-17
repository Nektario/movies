// iconSize is the width or height since these are equal sized icons
export function animateSvgIcon(durationMillis, numFrames, forwardsDirection, svg, iconSize) {
    let counter = forwardsDirection ? 1 : numFrames - 1

    if (!svg) return
    
    let timer = setInterval(() => {
        const newViewBoxX = iconSize * counter
        svg.setAttribute('viewBox', `${newViewBoxX} 0 ${iconSize} ${iconSize}`)

        if (!forwardsDirection) {
            if (counter === 1) {
                clearInterval(timer)
            }
            counter--
        } else {
            if (counter === numFrames) {
                clearInterval(timer)
            }
            counter++
        }
    }, durationMillis / numFrames)
}