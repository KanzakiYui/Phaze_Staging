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
                                            <Receipt info={this.state.successInfo} brand = {this.props.paymentInfo.name.code} value={this.props.paymentInfo.value} subtotal={this.props.paymentInfo.subtotal}/>
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
                        <p className='PIN'>
                            <span>{props.info.pin}</span>(PIN)
                        </p>:
                        null
                    }
                    <a className='AutoFill' href={autoFillLink} target="_blank" rel="noopener noreferrer">Auto Redeem Link</a>
                    <p className='Notice'>You can use above link to auto-redeem</p>
                </React.Fragment>
}

function Receipt(props){
    let brand = props.brand
    let value = '$'+props.value.toFixed(2)
    let fee = '$'+(props.value*0.02).toFixed(2)
    let subtotal = '$'+(props.value*1.02).toFixed(2)
    let grandtotal = '$'+props.subtotal.toFixed(2)
    let credit = '$'+(props.value*1.02 - props.subtotal).toFixed(2)
    function Download(){
        let doc = new window.jsPDF()
        let width = doc.internal.pageSize.getWidth()
        let left = 30
        let right = width - left
        doc.setFont('arial')
        doc.setFontStyle('bold')
        doc.setFontSize(24)
        doc.setTextColor(19, 127, 134)
        doc.text('Phaze Receipt', width/2, 20, 'center')
        doc.setFontSize(16)
        doc.setTextColor(58, 61, 70)
        doc.setFontStyle('bold')
        doc.text('Gift Card Brand', left, 40)
        doc.setFontStyle('normal')
        doc.text(brand, right, 40, 'right')
        doc.setFontStyle('bold')
        doc.text('Gift Card Value', left, 50)
        doc.setFontStyle('normal')
        doc.text(value, right, 50, 'right')
        doc.setFontStyle('bold')
        doc.text('Transaction Fee', left, 60)
        doc.setFontStyle('normal')
        doc.text(fee, right, 60, 'right')
        doc.setFontStyle('bold')
        doc.text('Subtotal', left, 70)
        doc.setFontStyle('normal')
        doc.text(subtotal, right, 70, 'right')
        doc.line(left, 80, right, 80)
        doc.setFontStyle('bold')
        doc.text('Credit Applied', left, 90)
        doc.setFontStyle('normal')
        doc.setTextColor(29, 165, 175)
        doc.text(credit, right, 90, 'right')
        doc.setTextColor(58, 61, 70)
        doc.line(left, 100, right, 100)
        doc.setTextColor(245, 13, 71)
        doc.setFontStyle('bold')
        doc.text('Grand Total', left, 110)
        doc.setFontStyle('normal')
        doc.text(grandtotal, right, 110, 'right')
        doc.setTextColor(58, 61, 70)
        doc.line(left, 120, right, 120)
        doc.setFontSize(20)
        doc.setTextColor(21, 61, 232)
        doc.setFontStyle('bold')
        if(props.info.link){
            let linkLeft = (width - doc.getTextWidth('Gift Card Link'))/2
            doc.textWithLink('Gift Card Link', linkLeft, 130, { url: props.info.link })
        }
        else{
            doc.text(props.info.code, width/2, 130, 'center')
            if(props.info.pin)                                  // sometimes, it may only have code, does not have pin
                doc.text(props.info.pin, width/2, 140, 'center')
        }
        window.open(URL.createObjectURL(doc.output("blob")), '_blank')
    }
    return <button className='button-2' onClick={Download}>Download Receipt</button>
}