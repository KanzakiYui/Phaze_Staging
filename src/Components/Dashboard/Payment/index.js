import React from 'react'
import './index.css'
import Scrollbar from 'smooth-scrollbar'
import Menu from '../Menu'
import Slider from "react-slick"
import Card from '../Card'
import Messagebox from '../../../Utilities/Message'
import {MoneyShow} from '../../../calculate'

class Payment extends React.Component{
    constructor(props){
        super(props)
        this.denomination = this.props.brandInfo?(this.props.brandInfo.array?true:false):false
        this.state={
            selectedValue: this.denomination?this.props.brandInfo.array[0]:0,                         // Default is $0
            openErrorBox: false,
            errorMessage: null,
            useCredit: false,
            openInfoBox: false                                                                                                
        }
    }
    componentDidMount(){
        if(!this.props.brandInfo){
            this.props.history.push('/dashboard')
            return
        }
        if(Scrollbar.has(document.body))
            Scrollbar.get(document.body).scrollTo(0, 0, 500)
        else
            window.scrollTo(0, 0)
    }
    ValueOnChange = (event)=>{
        let element = event.target
        if(!element.validity.valid)
            return
        this.setState({
            selectedValue: Math.round(Number(element.value))
        })
    }
    ValueOnBlur = (event) =>{
        let element = event.target
        if(!element.validity.valid)
            this.setState({
                openErrorBox: true,
                errorMessage: 'Invalid Amount',
            })
    }
    ValueUpdate = (index)=>{
        this.setState({
            selectedValue: this.props.brandInfo.array[index]
        })
    }
    GotoPay = ()=>{
        let element = document.getElementById('Payment-Select').querySelector('input')
        if(element){
            if(!element.validity.valid)
                return 
            let value = Number(element.value)
            if(value === 0 || isNaN(value))
                return
        }
        let discount = 0
        let subtotal = this.state.selectedValue*1.02
        if(this.state.useCredit)
            discount = Math.min (subtotal * this.props.maxCreditRate, this.props.availableCredit)
        subtotal = subtotal - discount
        this.props.GotoPay({
            value: this.state.selectedValue,
            useCredit: this.state.useCredit,                                    // 0 means no credit will be used
            subtotal: subtotal                                                                     // For convenience
        })
    }
    render(){
        if(!this.props.brandInfo)
            return null
        let paymentSelectContent = null
        if(this.denomination){
            let settings = {
                centerMode: true,
                centerPadding: "25%",
                dots: false,
                arrows: false,
                speed: 500,
                slidesToShow: 1,
                swipeToSlide: true,
                afterChange: this.ValueUpdate,
            }
            let cards = this.props.brandInfo.array.map((value, index)=><Card key={index} type={2} country={this.props.brandInfo.country} urlpath={this.props.brandInfo.code} value={value}/>)
            paymentSelectContent =  <div id='Payment-Select' className='Denomination'>
                                                        <Slider {...settings}>
                                                            {cards}
                                                        </Slider>
                                                      </div>
        }
        else{
            paymentSelectContent = <div id='Payment-Select' className='Arbitrary'>
                                                        <Card type={3} country={this.props.brandInfo.country} urlpath={this.props.brandInfo.code} min={this.props.brandInfo.min} max={this.props.brandInfo.max}/>
                                                        <input type='number' min={this.props.brandInfo.min} max={this.props.brandInfo.max} step="1" placeholder="Type Desired Amount" onChange={(event)=>this.ValueOnChange(event)} onBlur={(event)=>this.ValueOnBlur(event)}/>
                                                        <Messagebox open={this.state.openErrorBox} type='error' buttonText='Close' content={this.state.errorMessage} close={()=>this.setState({openErrorBox: false})}/>
                                                     </div>
        }
        let price = this.state.selectedValue
        let fee = price * 0.02                                                  // Hard-coded for now
        let discount = 0
        if(this.state.useCredit)
            discount = Math.min ((price+fee) * this.props.maxCreditRate, this.props.availableCredit)
        let subtotal = price + fee - discount
        let creditButtonClass = this.state.useCredit?'button-2':'button-1'
        let explanation = null
        if(this.props.availableCredit !==0)
            explanation =  <div id='Promotion-Explanation'>
                                        <p>Phaze Credit Guideline</p>
                                        <p>According to your promo code, you are eligible for applying <span>Phaze Credit</span> as part of your payment</p>
                                        <p>The maximum appliable amount is <span>{(this.props.maxCreditRate*100).toFixed(2)}</span>% of total fee</p>
                                        <p>The actual appliable amount will not be larger than your current credit balance, which is <span>${this.props.availableCredit}</span></p>
                                        <p>You can click <span>Apply Phaze Credit</span> to apply/remove credit and see how much you can actually apply</p>
                                    </div>
        return  <div id='Payment'>
                        <p id='Payment-Goback' onClick={this.props.history.goBack}><i className="fas fa-angle-double-left"></i>Go Back</p>
                            {paymentSelectContent}
                        <div id='Payment-Checkout'>
                            <p className='Title'>Order Summary</p>
                            <p className='Amount'>
                                Gift Card Balance
                                <span>$ {MoneyShow(price)}</span>
                            </p>
                            <p className='Fee'>
                                Transaction Fee (2%)
                                <span>$ {MoneyShow(fee)}</span>
                            </p>
                            {this.props.availableCredit === 0 ? null :
                                <React.Fragment>
                                    <p className='Credit'>
                                        <button className={creditButtonClass} onClick={()=>this.setState(prevState=>({useCredit: !prevState.useCredit}))}>{this.state.useCredit?"Remove PHAZE Credit":"Apply Phaze Credit"}</button>
                                        <span> - $ {MoneyShow(discount)} </span>
                                    </p>
                                    <p className='Detailed' onClick={()=>this.setState({openInfoBox: true})}>Click to See Explanation</p>
                                    <Messagebox open={this.state.openInfoBox} type='explain' buttonText='Close' content={explanation} close={()=>this.setState({openInfoBox: false})}/>
                                </React.Fragment>
                            }
                            <p className='Divider'></p>
                            <p className='Subtotal'>
                                Subtotal
                                <span>$ {MoneyShow(subtotal)}</span>
                            </p>
                        </div>
                        <Menu type={1} onClick={this.GotoPay} />
                    </div>
    }
}

export default Payment