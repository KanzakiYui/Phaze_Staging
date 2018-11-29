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
