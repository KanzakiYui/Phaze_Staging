import React from 'react'
import './index.css'
import CustomLoader from '../../../Utilities/CustomLoader'
import CryptoCard from '../CryptoCard'
import {walletToCode} from '../../../constants'
import {GetAPI} from '../../../https'
import QRCode from 'qrcode'

class Deposit extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            showContent: false,
            balance: 0,
            address: null,
            copy: false
        }
    }
    componentDidMount(){
        if(!this.props.kycVerified)
            this.props.history.goBack()
        this.walletName = this.props.location.state
        this.cryptoCurrency = walletToCode[this.walletName]
        this.GetBalance()
    }
    GetBalance = ()=>{
        GetAPI('users/list_balance/crypto/'+this.cryptoCurrency).then(response=>{
            this.setState({
                balance: response.result
            }, this.GetAddress)
            return null
        }).catch(()=>this.props.history.push('/'))
    }
    GetAddress = ()=>{
        GetAPI('crypto/get_address/crypto/'+this.cryptoCurrency).then(response=>{
            this.setState({
                address: response,
                showContent: true
            },()=>{
                let option = {errorCorrectionLevel: 'H'}
                QRCode.toCanvas(document.querySelector('#Deposit-Address>canvas'), this.state.address, option, (error)=>{
                    if(error)   console.log(error)
                })
            })
        }).catch(()=>this.props.history.push('/'))
    }
    Copy = ()=>{
        try{
            let tempElement = document.createElement('textarea')
            tempElement.value = this.state.address
            tempElement.setAttribute('readonly', '')
            tempElement.style.position = 'absolute'
            tempElement.style.left = '-9999px'
            document.body.appendChild(tempElement)
            tempElement.select()
            document.execCommand('copy')
            document.body.removeChild(tempElement)
            this.setState({
                copy: true
            })
        }catch(error){
            console.log(error)
        }
    }
    render(){
        if(!this.props.kycVerified)
            return null
        if(!this.state.showContent)
            return  <CustomLoader type='Oval' message='Loading Data' color='var(--color-red-normal)'/>
        return  <div id='Deposit'>
                        <p className='Goback' onClick={()=>this.props.history.goBack()}><i className="fas fa-long-arrow-alt-left"></i> BACK</p>
                        <p className='Title'>{this.walletName}</p>
                        <CryptoCard type={this.walletName} balance={this.state.balance}/>
                        <div id='Deposit-Address'>
                            <canvas></canvas>
                            <p>{this.state.address}</p>
                        </div>
                        <button onClick={()=>this.props.history.goBack()} className='button-2 Goback'><i className="fas fa-long-arrow-alt-left"></i></button>          
                        {!this.state.copy?
                            <button className='button-2' onClick={this.Copy}>Copy Address<i className="far fa-clone"></i></button>
                            :
                            <button className='button-2'>Copied<i className="fas fa-check"></i></button>
                        }
                    </div>
    }
}

export default Deposit
