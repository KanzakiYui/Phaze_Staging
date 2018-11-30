import React from 'react'

export function MoneyShow(string){
    string = Math.max(0, Number(string)).toFixed(2)
    let integer = string.split('.')[0]
    let decimal = string.split('.')[1]
    return  <React.Fragment>
                    <i>{integer}</i>.{decimal}
                </React.Fragment>
}

export function CryptoShow(string){
    string = Math.max(0, Number(string)).toFixed(8)
    let integer = string.split('.')[0]
    let decimal = string.split('.')[1]
    return  <React.Fragment>
                    {integer}.<i>{decimal}</i>
                </React.Fragment>
}

let monthNumberMapping = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function DateShow(string){
    let date = new Date(string)
    let part1 = monthNumberMapping[date.getMonth()]+" "+date.getDate()+", "
    let part2 = date.getFullYear()
    return  <React.Fragment>
                    <i>{part1}</i>{part2}
                </React.Fragment>
}

export function TimeShow(string){
    let date = new Date(string)
    let hours = date.getHours().toString().padStart(2, '0')
    let minutes = date.getMinutes().toString().padStart(2, '0')
    let seconds = date.getSeconds().toString().padStart(2, '0')
    return hours+":"+minutes+":"+seconds
}