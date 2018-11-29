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