self.addEventListener('install', function() {
    console.log('Service Worker is Installed')
})

self.addEventListener('fetch', function() {
    //console.log('Service Worker Fetched')
})

self.addEventListener('activate', function() {
    console.log('Service Worker is Activated')
})


self.addEventListener('notificationclick', function(event) {
    if(event.action){
        switch(event.action){
            case '0':
                console.log(false)
                break
            case '1':
                console.log(true)
                break
            default:
                console.log('Unknown', event.action)
                break
        }
        event.notification.close()
    }
})
self.addEventListener('notificationclose', function(event) {
    console.log(event)
})

