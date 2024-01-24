export const animateButton = (element: HTMLButtonElement | null) => {
    if(element) {
        element.style.transform = 'rotate(360deg)'
        element.disabled = true

        setTimeout(() => {
            if(element) {
                element.style.transform = 'rotate(0)'
            }
        }, 350)
        setTimeout(() => {
            if(element) {
                element.disabled = false
            }
        }, 700)
    }
}