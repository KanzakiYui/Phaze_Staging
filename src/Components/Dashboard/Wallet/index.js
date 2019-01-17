import React from 'react'
import './index.css'
import LOGO from '../../../Media/Images/Logo.png'
import {GetAPI} from '../../../https'
import CryptoCard from '../CryptoCard'

class Wallet extends React.Component{
    constructor(props){
        super(props)
        this.state={
            BTCbalance: 0,
            BCHbalance: 0,
            ETHbalance: 0,
            LTCbalance: 0,
            selected: null,
        }
    }
    componentDidMount(){
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth'})
        GetAPI('users/list_balance/crypto/ALL').then(response=>{
            this.setState({
                BTCbalance: response.result.btc_balance,
                BCHbalance: response.result.bch_balance,
                ETHbalance: response.result.eth_balance,
                LTCbalance: response.result.ltc_balance
            })
        }).catch(()=>this.props.history.push('/'))
    }
    SelectWallet = (event)=>{
        let element = event.target.closest('div.Half-Card')
        if(!element)
            return
        let wallet = element.dataset.value
        if( wallet === 'BitcoinCash'){
            // inactived wallet
        }
        else
            this.props.history.push({
                pathname: '/dashboard/walletdetail',
                state: element.dataset.value
            })
    }
    render(){
        if(!this.props.kycVerified)                                                                             // block from the very beginning
            return  <div id='Wallet'>
                            <div className='Error'>
                                <p className='Goback' onClick={()=>this.props.history.goBack()}><i className="fas fa-long-arrow-alt-left"></i> BACK</p>
                                <img src={LOGO} alt="" />
                                <p className='Title'>Verification Required</p>
                                <p>Visit your account to verify your identity and to activate your wallet.</p>
                                <button type='button' onClick={()=>this.props.history.goBack()} className='button-2 Goback'><i className="fas fa-long-arrow-alt-left"></i></button>
                                <button className='button-1' onClick={()=>this.props.history.push('/dashboard/account')}>Go to account<i className="fas fa-arrow-right"></i></button>
                            </div>
                        </div>
        return  <div id='Wallet'>
                        <p className='Title'>Crypto Wallets</p>
                        <div id='Wallet-Content' onClick={(event)=>this.SelectWallet(event)}>
                            <div className='Half-Card' data-value='Bitcoin'>
                                <CryptoCard type='Bitcoin' />
                                <p className='Line'></p>
                            </div>
                            <p className='Balance'>
                                <span>Balance</span>
                                <span>BTC {this.state.BTCbalance}</span>
                            </p>
                            <div className='Half-Card' data-value='Ethereum'>
                                <CryptoCard type='Ethereum' />
                                <p className='Line'></p>
                            </div>
                            <p className='Balance'>
                                <span>Balance</span>
                                <span>ETH {this.state.ETHbalance}</span>
                            </p>
                            <div className='Half-Card' data-value='Litecoin'>
                                <CryptoCard type='Litecoin' />
                                <p className='Line'></p>
                            </div>
                            <p className='Balance'>
                                <span>Balance</span>
                                <span>LTC {this.state.LTCbalance}</span>
                            </p>
                            <div className='Half-Card' data-value='BitcoinCash'>
                                <CryptoCard type='BitcoinCash'/>
                                <p className='Line'></p>
                            </div>
                            <p className='Balance'>
                                <span>Balance</span>
                                <span>BCH {this.state.BCHbalance}</span>
                            </p>
                        </div>
                    </div>
    }
}

export default Wallet