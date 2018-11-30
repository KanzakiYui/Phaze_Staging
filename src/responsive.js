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
    let height = window.innerHeight
    if(window.location.href.toLowerCase().indexOf('dashboard') !== -1)
        height = root.clientWidth*1.25  
    if(window.innerHeight < 450)
        height = 640                                        // hard coded for now             
    root.style.height = height+'px'
}

