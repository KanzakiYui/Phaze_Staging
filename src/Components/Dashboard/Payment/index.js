import React from 'react'
import './index.css'
import GiftCard from '../GiftCard'
import LOGO from '../../../Media/Images/Logo.png'
import {countryToCode, codeToCurrency} from "../../../constants"
import Debounce from '../../../Utilities/Debounce'

class Payment extends React.Component{
    constructor(props){
        super(props)
        this.state={
            type: null,
            price: 0,
            apply: false,
            openNote: false,
            priceError: false
        }
    }
    componentDidMount(){
        if(!this.props.brandInfo){
            this.props.history.push('/dashboard')
            return
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth'})
        this.setState({
            type:  this.props.brandInfo.array?0:1,                        // 0 means fixed denomination, 1 means arbitrary range
            price: this.props.brandInfo.array?this.props.brandInfo.array[0]:''
        })
    }
    ScrollLoad = (event)=>{
        event.currentTarget.addEventListener('scroll', Debounce(this.Scroll, 500))
    }
    Scroll = (event)=>{
        let offset = event.target.getBoundingClientRect().left
        let children = event.target.querySelectorAll('img')
        let array = Array.from(children)
        let index = -1
        for(let i = 0 ; i<array.length ; i ++){
            if(array[i].getBoundingClientRect().left + array[i].offsetWidth - offset > 0){
                index = i
                break
            }
        }
        if(index !== -1)
            this.setState({
                price: this.props.brandInfo.array[index]
            })
    }
    InputChange = (event)=>{
        let value = event.target.value
        if(/^[0-9]+$/.test(value) || value === ''){
            let min = this.props.brandInfo.min
            let max = this.props.brandInfo.max
            this.setState({
                price: value,
                priceError: (Number(value) > max) || (Number(value) < min)
            })
        }
    }
    Confirm = ()=>{
        if(this.state.priceError)
            return
        let price = Number(this.state.price)
        let total = price * 1.02
        let discount = this.state.apply?Math.min(this.props.promoInfo.amount, total*this.props.promoInfo.rate):0
        let result = {
            name: this.props.brandInfo.name,
            code: this.props.brandInfo.code,
            country: this.props.brandInfo.country,
            price : price,
            apply : this.state.apply,
            promo: this.props.promoInfo.code,
            total: Number((total - discount).toFixed(2))
        }
        this.props.ConfirmAmount(result)
    }
    render(){
        if(!this.props.brandInfo)
            return null
        let price = Number(this.state.price)
        let total = price*1.02
        let discount = total*this.props.promoInfo.rate                          // Note the rate has maximum of 1, which means discount <= total
        // The following is considering all available credit user currently has
        let creditBalance = this.props.promoInfo.amount
        discount = Math.min(creditBalance, discount)                        // Still discount <= total
        if(this.state.apply)
            total = total - discount                                                         // In this case, total >= 0 (won't be negative)
        let currency = codeToCurrency[countryToCode[this.props.brandInfo.country]]
        let content = null
        let amount = null
        if(this.state.type===0){
            let items = this.props.brandInfo.array.map((item, index)=><GiftCard key={index} urlpath={this.props.brandInfo.code}/>)
            content = <div onLoad={(event)=>this.ScrollLoad(event)} className='Denomination-Content'>
                                {items}
                            </div>
            amount =  <span>${price.toFixed(2)}</span>
        }
        else{
            content = <div className='Range-Content'>
                                <GiftCard urlpath={this.props.brandInfo.code}/>
                            </div>
            let placeholder = this.props.brandInfo.min+'~'+this.props.brandInfo.max
            amount = <div className='Range-Input'>
                                $
                                <input className={this.state.priceError?"Error":""} type='text' onChange={(event)=>this.InputChange(event)} value={this.state.price} placeholder={placeholder}/>
                                .00 {this.state.priceError?<p className='Error'>{'only '+placeholder+' is allowed'}</p>:null}
                            </div>
        }
        return  <div id='Payment'>
                        <div id='Payment-Background'></div>
                        <p className='Goback' onClick={()=>this.props.history.push('/dashboard')}><i className="fas fa-long-arrow-alt-left"></i> SHOP</p>
                        <p className='Title'>{this.props.brandInfo.name}</p>
                        {content}
                        <div className='DetailPanel'>
                            <div>
                                <i className="fas fa-money-bill"></i>
                                <span></span>
                                {amount}
                            </div>
                            <div>
                                <i className="fas fa-hand-holding-usd"></i>
                                <span>(+)</span>
                                <span>${(price*0.02).toFixed(2)}</span>
                            </div>
                            <div className={this.state.apply?"Apply":""}>
                                <i><img src={LOGO} alt="" /></i>
                                <span>(-)</span>
                                <span><i className="fas fa-exclamation-circle" onClick={()=>this.setState({openNote: true})}></i>${discount.toFixed(2)}</span>
                                {this.state.apply?
                                     <button className='Apply'><i className="fas fa-check"></i>Applied</button>
                                    :<button onClick={()=>this.setState({apply: true})}><i className="fas fa-long-arrow-alt-left"></i>Apply</button>
                                }   
                            </div>
                        </div>
                        <div className='Total'>
                            <span>Total</span>
                            <span>${total.toFixed(2)} <small>{currency}</small></span>
                        </div>
                        <button onClick={()=>this.props.history.push('/dashboard')} className='button-2 Goback'><i className="fas fa-long-arrow-alt-left"></i></button>
                        <button className='button-2 Confirm' onClick={this.Confirm}>confirm<i className="fas fa-arrow-right"></i></button>
                        {this.state.openNote?
                            <div id='Payment-CreditNote'>
                                <i className="fas fa-times" onClick={()=>this.setState({openNote: false})}></i>

                            </div>
                            :null
                        }
                    </div>
    }
}

export default Payment


