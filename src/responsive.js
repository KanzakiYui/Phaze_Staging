import Scrollbar from 'smooth-scrollbar'
export let Debounce = (handler, delay) =>{
    delay = delay || 200                                // default is 200ms delay
    let timer                                                  // closure
    return function(){
        if(timer)
            clearTimeout(timer)
        timer = setTimeout(handler, delay)
    }
}

export let Responsive = () =>{
    let hasBar = Scrollbar.has(document.body)
    if(window.screen.width>=576 && !hasBar)
        Scrollbar.init(document.body,{alwaysShowTracks: true})
    else if(window.screen.width < 576 && hasBar)
        Scrollbar.destroy(document.body)
    let root = document.getElementById('root')
    if(!root)
        return
    let height = Math.max(window.innerHeight, 640)
    if(window.screen.width >= 768 && window.location.href.toLowerCase().includes('dashboard')){
        let href = window.location.href.toLowerCase()
        let width = root.clientWidth
        height = width * 1.2
        if( href.includes('account') || href.includes('identity'))
            height = Math.max(width, 768)
    }
    root.style.height = height+'px'
}

