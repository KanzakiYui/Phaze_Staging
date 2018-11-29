import React from 'react'
import './index.css'
import CustomLoader from '../../../Utilities/CustomLoader'
import {GetAPI, GetOther, POSTAPI} from '../../../https'
import {countryToCode, codeToCurrency, walletToCode} from '../../../constants'
import Slider from "react-slick"
import CryptoCard from '../CryptoCard'
import Scrollbar from 'smooth-scrollbar'
import Messagebox from '../../../Utilities/Message'

class Checkout extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            walletInfo: null,
            showContent: false,
            currentWalletIndex: 1,
            status: 0,
            messageOpen: false,
            errorMessage: null,
            successInfo: null
        }
    }
    componentDidMount(){
        if(!this.props.paymentInfo){
            this.props.history.push('/dashboard')
            return
        }
        if(Scrollbar.has(document.body))
            Scrollbar.get(document.body).scrollTo(0, 0, 500)
        else
            window.scrollTo(0, 0)
        let PDF = new window.jsPDF()
        console.log(PDF)
        this.FetchAllBalance()
    }
    FetchAllBalance = ()=>{
        GetAPI('users/list_balance/crypto/ALL').then(response=>{
            this.FetchAllRate(response.result)
            return null
        }).catch(()=>this.props.history.push('/dashboard'))
    }
    FetchAllRate = async (balance) =>{
        let countryCode = codeToCurrency[countryToCode[this.props.paymentInfo.name.country]]
        let [BTC, LTC, ETH] = await Promise.all([
            GetOther('https://api.coinbase.com/v2/prices/BTC-'+countryCode+'/sell'),
            GetOther('https://api.coinbase.com/v2/prices/LTC-'+countryCode+'/sell'),
            GetOther('https://api.coinbase.com/v2/prices/ETH-'+countryCode+'/sell')
        ])
        BTC = Number(BTC.data.amount).toFixed(2)
        LTC = Number(LTC.data.amount).toFixed(2)
        ETH = Number(ETH.data.amount).toFixed(2)
        this.setState({
            walletInfo: [
                {name:'Bitcoin', balance: balance.btc_balance, rate: BTC, value: (Number(balance.btc_balance)*Number(BTC)).toFixed(2)},
                {name:'Litecoin',balance: balance.ltc_balance, rate: LTC, value: (Number(balance.ltc_balance)*Number(LTC)).toFixed(2)},
                {name:'Ethereum',balance: balance.eth_balance, rate: ETH, value: (Number(balance.eth_balance)*Number(ETH)).toFixed(2)}
            ],
            showContent: true
        })
    }
    ChangedWallet = (index)=>{
        this.setState({
            currentWalletIndex: index
        })
    }
    Pay = ()=>{
        this.setState({
            status: 1                                                   // 1 means processing
        },()=>{
            let body = {
                brand: this.props.paymentInfo.name.code,
                price: this.props.paymentInfo.value*100,
                currency: codeToCurrency[countryToCode[this.props.paymentInfo.name.country]],
            }
            if(Math.abs(this.props.paymentInfo.subtotal - 0) > 0.01)
                body.crypto = walletToCode[this.state.walletInfo[this.state.currentWalletIndex].name]
            else
                body.crypto = 'CREDIT'
            if(this.props.paymentInfo.useCredit)
                body.discount_code = this.props.promoInfo.code                                        // placeholder for now
            POSTAPI('merchant/purchase', body).then(response=>{
                this.setState({
                    errorMessage: null,
                    status: 3,
                    successInfo: response
                }, this.AfterPayUpdate)
                return null
            }).catch(error=>{
                if(error.statusCode === 401)
                    this.props.history.push('/')
                else
                    this.setState({
                        status: 2,
                        messageOpen: true,
                        errorMessage: error.statusCode === 400?'Your Wallet Balance Is Insufficient':'Internal Errors Happen'
                    })
            })
        })
    }
    AfterPayUpdate = ()=>{
        this.props.updateAfterPay()
        this.FetchAllBalance()
    }
    render(){
        if(!this.state.showContent)
            return <CustomLoader type='Audio' message='Loading Data' color='var(--color-red-dark)'/>
        let statusContent = null
        if(this.state.status === 0)
            statusContent =   <div id='Checkout-Confirm'>
                                            <button onClick={this.Pay}>Confirm to Purchase</button>
                                        </div>
        else if(this.state.status === 1)
            statusContent =   <div id='Checkout-Processing'>
                                            <CustomLoader type='Watch' message='Processing' color='var(--color-cyan-light)'/>
                                        </div>
        else if(this.state.status === 2)
            statusContent =   <div id='Checkout-Retry'>
                                            <button onClick={this.Pay}>Retry to Purchase</button>
                                        </div>
        else if(this.state.status === 3)
            statusContent =   <div id='Checkout-Success'>
                                            <SucessInfo info={this.state.successInfo} brandCode = {this.props.paymentInfo.name.code}/>
                                            <p className='Goback' onClick={this.props.history.goBack}>
                                                <i className="fas fa-sign-out-alt"></i>
                                                Go Back
                                            </p>
                                        </div>
        /* when user choose to use credit for full payment */
        if(Math.abs(this.props.paymentInfo.subtotal - 0) < 0.01 && this.props.paymentInfo.useCredit)
            return  <div id='Checkout'>
                            <p id='Checkout-Cancel' onClick={()=>this.props.history.push('/dashboard')}>
                                <i className="fas fa-times"></i>
                                Cancel Payment
                            </p>
                            <div id='Checkout-CreditCard'>
                                <CryptoCard type={1} info={this.props.promoInfo} />
                            </div>
                            <div id='Checkout-Flow'>
                                <div className='Flow-1'>
                                    <p>Your <span>{(this.props.paymentInfo.value * 1.02).toFixed(2)}</span> credit</p>
                                </div>
                                <div className='Flow'>
                                    <i className="fas fa-long-arrow-alt-down"></i>
                                    <p>Will be magically converted to</p>
                                </div>
                                <div className='Flow-2'>
                                    <p>$ <span>{this.props.paymentInfo.value}</span> gift card (plus transaction fee) </p>
                                    <p><span>{this.props.paymentInfo.name.name}</span> ({this.props.paymentInfo.name.country})</p>
                                </div>
                            </div>
                            <div id='Checkout-Status'>
                                {statusContent}
                            </div>
                            <Messagebox open={this.state.messageOpen} type='error' buttonText='Close' content={this.state.errorMessage} close={()=>this.setState({messageOpen: false})} />
                        </div>
            
        /* when user cannot use credit for full payment */
        let padding = null
        if(this.props.screenWidth < 360)    padding = '7.5%'
        else if(this.props.screenWidth < 576) padding = '8%'
        else if(this.props.screenWidth < 672) padding = '9%'
        else if(this.props.screenWidth < 768) padding = '10%'
        else padding = '15%'
        let settings = {
            centerMode: true,
            centerPadding: padding,
            dots: false,
            infinite: false,
            initialSlide: this.state.currentWalletIndex,
            arrows: false,
            speed: 500,
            slidesToShow: 1,
            swipe: (this.state.status === 0 || this.state.status === 2) ? true : false,
            swipeToSlide: (this.state.status === 0 || this.state.status === 2) ? true : false,
            afterChange: this.ChangedWallet,
        }
        let currency = codeToCurrency[countryToCode[this.props.paymentInfo.name.country]]
        let wallet = this.state.walletInfo[this.state.currentWalletIndex]
        let rate = wallet.rate
        let price = (Number(this.props.paymentInfo.subtotal)/Number(rate)).toFixed(8)
        let walletCode = walletToCode[wallet.name]
        let discount = (this.props.paymentInfo.value * 1.02  - this.props.paymentInfo.subtotal).toFixed(2)
        return  <div id='Checkout'>
                        <p id='Checkout-Cancel' onClick={()=>this.props.history.push('/dashboard')}>
                            <i className="fas fa-times"></i>
                            Cancel Payment
                        </p>
                        <div id='Checkout-Wallets'>
                            <Slider {...settings}>
                                <CryptoCard type={0} category={this.state.walletInfo[0].name} info={this.state.walletInfo[0]} currency={currency} kycVerified={this.props.kycVerified} GotoKYC={()=>this.props.history.push('/dashboard/identity')}/>
                                <CryptoCard type={0} category={this.state.walletInfo[1].name} info={this.state.walletInfo[1]} currency={currency} kycVerified={this.props.kycVerified} GotoKYC={()=>this.props.history.push('/dashboard/identity')}/>
                                <CryptoCard type={0} category={this.state.walletInfo[2].name} info={this.state.walletInfo[2]} currency={currency} kycVerified={this.props.kycVerified} GotoKYC={()=>this.props.history.push('/dashboard/identity')}/>
                            </Slider>
                        </div>
                        <div id='Checkout-Flow'>
                            <div className='Flow-1'>
                                <p>Your <span>{price}</span> <span>{walletCode}</span> from wallet</p>
                            </div>
                            <div className='Flow'>
                                <i className="fas fa-long-arrow-alt-down"></i>
                                <p>Will be magically converted to</p>
                            </div>
                            <div className='Flow-2'>
                                <p>$ <span>{this.props.paymentInfo.value}</span> gift card (<span>{discount}</span> Phaze Credit) </p>
                                <p><span>{this.props.paymentInfo.name.name}</span> ({this.props.paymentInfo.name.country})</p>
                            </div>
                        </div>
                        <div id='Checkout-Status'>
                            {statusContent}
                        </div>
                        <Messagebox open={this.state.messageOpen} type='error' buttonText='Close' content={this.state.errorMessage} close={()=>this.setState({messageOpen: false})} />
                    </div>
    }
}

export default Checkout

function SucessInfo(props){
    if(props.info.link)
        return  <React.Fragment>
                        <p className='Title'>Thanks For Your Purchase</p>
                        <a href={props.info.link} target="_blank" rel="noopener noreferrer">Gift Card Link</a>
                        <p className='Notice'>Click above link to view gift card info</p>
                    </React.Fragment>
    let autoFillLink = null
    if(props.brandCode.indexOf('amazonca'))
        autoFillLink = 'https://www.amazon.ca/gc/redeem?code='+props.info.code
    return  <React.Fragment>
                    <p className='Title'>Thanks For Your Purchase</p>
                    <p className='Code'>
                        <span>{props.info.code}</span>(CODE)
                    </p>
                    {props.info.pin?
                        <p className='Code'>
                            <span>{props.info.pin}</span>(PIN)
                        </p>:
                        null
                    }
                    <a className='AutoFill' href={autoFillLink} target="_blank" rel="noopener noreferrer">Auto Redeem Link</a>
                    <p className='Notice'>You can use above link to auto-redeem</p>
                </React.Fragment>
}