import React from 'react'
import './index.css'
import {GetAPI} from '../../../https'
import CustomLoader from '../../../Utilities/CustomLoader'
import Card from '../Card'
import {MoneyShow, CryptoShow, DateShow, TimeShow} from '../../../calculate'

class Orders extends React.Component{
    constructor(props){
        super(props)
        this.state={
            showContent: false,
            allOrders: null,
            filterResult: null,
            index: 0,
            prev: false,
            next: false
        }
    }
    componentDidMount(){
        this.FetchOrders()
    }
    FetchOrders = () => {
        GetAPI('users/list_txns/brand/ALL/crypto/ALL').then(response=>{
            let result = response.result.sort((a, b)=>new Date(b.time).getTime() - new Date(a.time).getTime())
            this.setState({
                showContent: true,
                allOrders: result,
                filterResult: result,
                next: result.length > 1 ? true: false
            })
        }).catch(error=>{
            if(error.statusCode === 401)
                this.props.push('/')
        })
    }

    FormSubmit = (event)=>{
        event.preventDefault()
        let brand = event.target['order-filter-brand'].value
        let price = event.target['order-filter-price'].value
        let date = event.target['order-filter-date'].value
        let result = this.state.allOrders.slice(0)
        if(brand)
            result = result.filter(item=>item.brand.toLowerCase().indexOf(brand.toLowerCase())!==-1)
        if(price)
            result = result.filter(item=>Number(item.price)/100 === Number(price))
        if(date)
            result = result.filter(item=>{
                let time = item.time.slice(0, item.time.indexOf('T'))
                let date1 = new Date(time)
                let date2 = new Date(date)
                return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()
            })
        this.setState({
            filterResult: result,
            index: 0,
            prev: false,
            next: result.length > 1 ? true : false
        })
    }

    Prev = ()=>{
        this.setState(prevState=>({
            index: prevState.index - 1,
            prev: prevState.index === 1? false : true,
            next: true
        }))
    }

    Next = () =>{
        let max = this.state.filterResult.length - 1
        this.setState(prevState=>({
            index: prevState.index + 1,
            prev: true,
            next: prevState.index === max - 1? false : true
        }))
    }
    render(){
        if(!this.state.showContent)
            return <CustomLoader type='Oval' message='Loading Data' color='var(--color-red-dark)'/>
        let info = this.state.filterResult[this.state.index]
        let content = null
        if(!info){
            content = <div id='Orders-None'>
                                <i className="fas fa-exclamation-triangle"></i> no past order matched
                            </div>
        }
        else{
            let prevButton = this.state.prev?<i className="Left fas fa-arrow-circle-left" onClick={this.Prev}></i>:null
            let nextButton = this.state.next?<i className="Right fas fa-arrow-circle-right" onClick={this.Next}></i>:null
            let discount = (Number(info.price)+Number(info.fee)-Number(info.price_charged))/100
            content = <div id='Orders-Detail'>
                                <div className='Title'>
                                    <span>{this.state.index+1}</span>-th Order
                                    <p>
                                        (<span>{this.state.filterResult.length}</span> Orders)
                                    </p>
                                </div>
                                <div id='Orders-Detail-Show'>
                                    <div>
                                        <Card urlpath={info.brand} type={5} />
                                        <p>${MoneyShow(Number(info.price)/100)} {info.currency}</p>
                                    </div>
                                    <div>
                                        <p>Fee</p>
                                        <p>+ ${MoneyShow(Number(info.fee)/100)}</p>
                                    </div>
                                    <div>
                                        <p>Credit</p>
                                        <p>- ${MoneyShow(discount)}</p>
                                    </div>
                                    <div>
                                        <p>Subtotal</p>
                                        <p>= ${MoneyShow(Number(info.price_charged)/100)}</p>
                                    </div>
                                    <div>
                                        <p>Cost</p>
                                        <p>{CryptoShow(info.price_crypto)} {info.crypto}</p>
                                    </div>
                                    <div>
                                        <p>Date</p>
                                        <p>{DateShow(info.time)}</p>
                                    </div>
                                    <div>
                                        <p>Time</p>
                                        <p>{TimeShow(info.time)}</p>
                                    </div>
                                    {info.code?
                                        <div className='Code'>
                                            <p>Code</p>
                                            <p>{info.code}</p>
                                        </div>
                                        :null
                                    }
                                    {info.pin?
                                        <div className='PIN'>
                                            <p>PIN</p>
                                            <p>{info.pin}</p>
                                        </div>
                                        :null
                                    }
                                    {info.link?
                                        <div className='Link'>
                                            <p>Link</p>
                                            <a href={info.link} target="_blank" rel="noopener noreferrer">Click to View</a>
                                        </div>
                                        :null
                                    }
                                </div>
                                {prevButton}
                                {nextButton}
                            </div>
        }
        return <div id='Orders'>
                    <p className='Title'>Order History</p>
                    <div id='Orders-Filter'>
                        <p className='Title'>Filter</p>
                        <form id='Orders-Filter-Form' onSubmit={(event)=>this.FormSubmit(event)} noValidate>
                            <div>
                                <label htmlFor='order-filter-brand'>
                                    <i className="fas fa-store"></i>
                                    Brand
                                </label>
                                <input id='order-filter-brand' name='order-filter-brand' type='text' maxLength='20' spellCheck="false"/>
                            </div>
                            <div>
                                <label htmlFor='order-filter-price'>
                                    <i className="fas fa-money-bill-wave"></i>
                                    Price
                                </label>
                                <input id='order-filter-price' name='order-filter-price' type='number'/>
                            </div>
                            <div>
                                <label htmlFor='order-filter-date'>
                                    <i className="far fa-calendar-alt"></i>
                                    Date
                                </label>
                                <input id='order-filter-date' name='order-filter-date' type='date'/>
                            </div>
                            <div>
                                <button className='button-2' type='reset'>Reset</button>
                                <button className='button-1' type='submit'>Search</button>
                            </div>
                        </form>
                    </div>
                    {content}
                  </div>
    }
}

export default Orders
