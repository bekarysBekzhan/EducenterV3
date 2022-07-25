const getAudioUrl = (html) => {
    let url = ""
    let pattern = new RegExp("src=")
    let audioFormats = [".mp3", ".aac", ".ogg", ".aa", ".wav", ".aiff", ".alac", ".wma"]

    let start = pattern.exec(html)
    if(start !== null) {
        console.log(start)
        // url = html.slice()
    }

    audioFormats.forEach(format => {
        
    });

    return url
}