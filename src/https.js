import requestPromise from 'request-promise'

let API = "https://webstaging.phaze.io/api/"
// let API = "https://www.webapp.phaze.io/api/"

export function GetAPI(url){
    return requestPromise({
        method: 'GET',  
        url: API+url,
        json: true, 
        withCredentials: true
    })
}

export function POSTAPI(url, body){
    return requestPromise({
        method: 'POST',  
        url: API+url, 
        body: body, 
        json: true, 
        withCredentials: true,
    })
}

export function CheckAuth(){
    return requestPromise({
        method: 'GET',  
        url: API+'users/check_auth',
        json: true, 
        withCredentials: true,
    })
}

export function GetOther(url){
    return requestPromise({
        url: url,
        json: true
    })
}
