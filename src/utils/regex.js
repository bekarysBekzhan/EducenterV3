export const getAudioUrl = (html) => {
    let pattern1 = new RegExp("src=")
    let pattern2 = null
    let audioFormats = [".mp3", ".aac", ".ogg", ".aa", ".wav", ".aiff", ".alac", ".wma"]

    let start = pattern1.exec(html)
    if(start !== null) {
        let startIndex = start.index + 4
        let finishIndex = null
        if(audioFormats.filter(format => {
            if(html.includes(format)) {
                pattern2 = new RegExp(format)
                return true
            }
            return false
        }).length !== 0) {
            let finish = pattern2.exec(html)
            finishIndex = finish.index + 4
        }

        // console.log(html.slice(startIndex, finishIndex + 1))

        return html.slice(startIndex, finishIndex + 1)
    }

    return null
}