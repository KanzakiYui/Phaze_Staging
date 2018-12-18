import React from 'react'
import './index.css'
import GiftCard from '../GiftCard'
import CryptoCard from '../CryptoCard'
import {GetAPI} from '../../../https'

class Checkout extends React.Component{
    constructor(props){
        super(props)
        this.state={
            balance: { 'Bitcoin': 0, 'Ethereum': 0, 'Litecoin': 0}
        }
    }
    componentDidMount(){
        if(!this.props.amountInfo){
            this.props.history.push('/dashboard')
            return
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth'})
        console.log(this.props.amountInfo)
        this.GetBalance()
    }
    GetBalance = ()=>{
        GetAPI('users/list_balance/crypto/ALL').then(response=>{
            this.setState({
                balance: {
                    'Bitcoin': response.result.btc_balance, 
                    'Ethereum': response.result.eth_balance, 
                    'Litecoin': response.result.ltc_balance
                }
            })
            return null
        }).catch(()=>this.props.history.push('/dashboard'))
    }
    render(){
        if(!this.props.amountInfo)
            return null
        let Cards = ['Bitcoin', 'Ethereum', 'Litecoin'].map((value, index)=><CryptoCard key={index} type={value} balance={this.state.balance[value]} />)
        return  <div id='Checkout'>
                        <div id='Checkout-Background'></div>
                        <p className='Goback' onClick={()=>this.props.history.push('/dashboard')}><i className="fas fa-long-arrow-alt-left"></i> SHOP</p>
                        <p className='Title'>{this.props.amountInfo.name}</p>
                        <div className='Half-Card'>
                            <GiftCard urlpath={this.props.amountInfo.code} />
                        </div>
                        <p className='Tooltip-1'>You are converting</p>
                        <p className='Tooltip-2'>${this.props.amountInfo.total.toFixed(2)}<span>(${this.props.amountInfo.price} gift card)</span></p>
                        <div className='CryptoCard-Content'>
                            {Cards}
                        </div>
                    </div>
    }
}
export default Checkout