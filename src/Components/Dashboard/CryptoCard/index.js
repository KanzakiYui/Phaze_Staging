import React from 'react'
import './index.css'
import {walletToCode} from '../../../constants'
import {MoneyShow, CryptoShow} from '../../../calculate'
import {GetAPI} from '../../../https'
import QRCode from 'qrcode'
import CreditLogo from '../../../Media/Images/Coins/Credit.png'

class CryptoCard extends React.Component{
    constructor(props){
        super(props)
        this.qrRef = React.createRef()
        this.copyTooltipTimer = null
        this.state={
            url: null,
            address: null,
            showCopyTooltip: false,
        }
    }
    componentDidMount(){
        if(this.props.type === 1)
            return
        import('../../../Media/Images/Coins/'+this.props.category+'.png').then(url=>this.setState({url: url.default})).catch(()=>{})
        if(this.props.kycVerified){
            GetAPI('crypto/get_address/crypto/'+walletToCode[this.props.category]).then(response=>
                this.setState({
                    address: response
                },()=>{
                    let option = {errorCorrectionLevel: 'H', margin: 1, color:{
                        light: '#ffffff00',
                        dark: '#000000'
                    }}
                    QRCode.toCanvas(this.qrRef.current, this.state.address, option, (error)=>{
                        if(error)  console.log(error)
                    })
                })
            ).catch(()=>{})
        }
    }
    componentWillUnmount(){
        clearInterval(this.copyTooltipTimer)
    }
    Copy = ()=>{
        clearInterval(this.copyTooltipTimer)
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
                showCopyTooltip: true
            },()=>this.copyTooltipTimer = setTimeout(()=>this.setState({
                showCopyTooltip: false
            }), 3000))
        }catch(error){
            console.log(error)
        }
    }
    render(){
        let walletCode = walletToCode[this.props.category]
        let leftContent = this.props.kycVerified?
        <React.Fragment>
            <canvas ref={this.qrRef}></canvas>
            <button className='button-1' onClick={this.Copy}>Copy Address</button>
            {this.state.showCopyTooltip?
                <div className="Tooltip">
                    <p>Copied!</p>
                    <div className='Arrow'></div>
                </div>:null
            }
        </React.Fragment>
        :
        <React.Fragment>
            <p className='NeedKYC'>Verify Your Identity Before Deposit</p>
            <button className='button-1' onClick={this.props.GotoKYC}>Do it Now</button>
        </React.Fragment>
        switch(this.props.type){
            case 0:
                return  <div className={'CryptoCard '+this.props.category}>
                                <div>
                                    {leftContent}
                                </div>
                                <div>
                                    <div className='LOGO'>
                                        <img src={this.state.url} alt="" /><p>{this.props.category}</p>
                                    </div>
                                    <div className='Info'>
                                        <p>{CryptoShow(this.props.info.balance)}<span>{walletCode}</span></p>
                                        <p>$ {MoneyShow(this.props.info.value)}<span>{this.props.currency}</span></p>
                                        <p>{MoneyShow(this.props.info.rate)} <span>{this.props.currency}/{walletCode}</span></p>
                                    </div>
                                </div>
                                <div className='Arrow'></div>
                            </div>
            case 1:
                return  <div className='CreditCard'>
                                <div>
                                    <p>PHAZE</p>
                                    <img src={CreditLogo} alt="" />
                                    <p>Credit</p>
                                </div>
                                <div>
                                    <p><i className="fas fa-coins"></i>Balance</p>
                                    <p>$ {MoneyShow(this.props.info.amount)}</p>
                                </div>
                                <div>
                                    <p><i className="fas fa-gift"></i>Applicable Rate</p>
                                    <p>{this.props.info.rate*100} %</p>
                                </div>
                                <div>
                                    <p><i className="fas fa-barcode"></i>Promo Code</p>
                                    <p>{this.props.info.code}</p>
                                </div>
                            </div>
            default:
                return null
        }
    }
}

export default CryptoCard