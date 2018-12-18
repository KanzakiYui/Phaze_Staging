import React from 'react'
import './index.css'
import BitcoinLOGO from '../../../Media/Images/Coins/Bitcoin.png'
//import EthereumLOGO from '../../../Media/Images/Coins/Ethereum.png'
//import LiteCoinLOGO from '../../../Media/Images/Coins/Litecoin.png'
import {walletToCode} from '../../../constants'

class CryptoCard extends React.Component{
    
    render(){
        switch(this.props.type){
            case 'Bitcoin':
                return  <div className= 'CryptoCard Bitcoin'>
                                <div>
                                    <img src={BitcoinLOGO} alt="" />
                                    <p>bitcoin</p>
                                </div>
                                <div>
                                    <p>Your balance:</p>
                                    <p>{walletToCode[this.props.type]} {this.props.balance}</p>
                                </div>
                            </div>
            default:
                return null
        }
    }
}

export default CryptoCard
