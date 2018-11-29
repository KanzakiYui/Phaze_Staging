import React from 'react'
import './index.css'
import {Switch, Route} from 'react-router-dom'
import Loadable from 'react-loadable'
import LoadingIndicator from '../Loading'

import {GetAPI, CheckAuth} from '../../https'
import {codeToCurrency, currencyToCountry} from '../../constants'
import Messagebox from '../../Utilities/Message'
import TimerButton from '../../Utilities/TimerButton'
import CustomLoader from '../../Utilities/CustomLoader'
import Menu from './Menu'
import {Debounce} from '../../responsive'

const Shop = Loadable({ loader: () => import('./Shop'), loading: LoadingIndicator, delay: 1000, render(loaded, props){ let Component = loaded.default; return <Component {...props}/>} })
const Payment = Loadable({ loader: () => import('./Payment'), loading: LoadingIndicator, delay: 1000, render(loaded, props){ let Component = loaded.default; return <Component {...props}/>} })
const Checkout = Loadable({ loader: () => import('./Checkout'), loading: LoadingIndicator, delay: 1000, render(loaded, props){ let Component = loaded.default; return <Component {...props}/>} })
const Account = Loadable({ loader: () => import('./Account'), loading: LoadingIndicator, delay: 1000, render(loaded, props){ let Component = loaded.default; return <Component {...props}/>} })
const Identity = Loadable({ loader: () => import('./Identity'), loading: LoadingIndicator, delay: 1000, render(loaded, props){ let Component = loaded.default; return <Component {...props}/>} })

class Dashboard extends React.Component{
    constructor(props){
        super(props)
        this.state={
            isMobile: window.innerWidth < 768,
            screenWidth: window.innerWidth,
            username: null,
            emailVerified: false,
            kycVerified: false,
            kycCountry: null,
            promoInfo: null,
            brandInfo: null,
            showContent: false,                                  // when everything is done, show content
            menuAvailable: true,
            selectedBrand: null,
            paymentInfo: null,
        }
    }
    componentDidMount(){
        setTimeout(this.UserCheck, 500)
        this.responsiveChange = Debounce(this.IsMobile, 500)
        window.onresize = this.responsiveChange
    }
    componentWillUnmount(){
        window.removeEventListener('resize', this.responsiveChange)
    }
    componentDidUpdate(){
        let url = window.location.href
        if(url[url.length-1] === '/')
            url = url.slice(0, -1)
        let suffix = url.split('/').pop().toLowerCase()
        let shouldShowMenu = suffix !== 'payment' && suffix !== 'checkout' && suffix !== 'identity'
        if(shouldShowMenu&&!this.state.menuAvailable)
            this.setState({menuAvailable: true})
        else if(!shouldShowMenu&&this.state.menuAvailable)
            this.setState({menuAvailable: false})
    }
    IsMobile = ()=>{
        let mobile = window.innerWidth < 576
        if(mobile !== this.state.isMobile)
            this.setState({isMobile: mobile, screenWidth: window.innerWidth})
    }
    UserCheck = async () =>{
        CheckAuth().then(response=>{
            if(!response.type)
                this.setState({showContent: true, username: response.username})  
            else if(response.type==='EMAIL_VERIFIED')
                this.setState({username: response.username, emailVerified: true}, this.GetPromo)
            else if(response.type==='VERIFIED_CA')
                this.setState({username: response.username, emailVerified: true, kycVerified:true, kycCountry: 'Canada'}, this.GetPromo)
            else if(response.type==='VERIFIED_US')
                this.setState({username: response.username, emailVerified: true, kycVerified:true, kycCountry: 'United States'}, this.GetPromo)
            return null
        }).catch(this.Logout)
    }
    SendEmailVerification = ()=>{
        GetAPI('users/send_verify_email').then(()=>{}).catch(this.Logout)
    }
    GetPromo = ()=>{
        GetAPI('users/list_coupons').then(response=>{
            this.setState({promoInfo: PromotionParse(response)}, this.GetBrands)
            return null
        }).catch(this.Logout)
    }
    GetBrands =()=>{
        GetAPI('merchant/list_brands/country/ALL').then(response=>{
            this.setState({
                brandInfo: BrandParse(response),
                showContent: true
            })
            return null
        }).catch(this.Logout)
    }
    Logout = ()=>{
        GetAPI('public/logout').then(()=>{
            this.props.history.push('/')
            return null
        }).catch(()=>{})
    }
    SelectBrand = (value)=>{
        let brand = this.state.brandInfo.filter(item=>item.code === value)[0]
        this.setState({
            selectedBrand: brand
        },()=>this.props.history.push('/dashboard/payment'))
    }
    GotoPay = (info)=>{
        this.setState({
            paymentInfo: {
                name: this.state.selectedBrand,
                value: info.value,
                useCredit: info.useCredit,
                subtotal: info.subtotal
            }
        },()=>this.props.history.push('/dashboard/checkout'))
    }
    render(){
        if(!this.state.emailVerified && this.state.showContent){
            let content= <div className='VerifyEmailNotice'>
                                    <p className='Title'><i className="fas fa-exclamation-circle"></i> Active Your Account</p>
                                    <p className='Description'>
                                        You need to active your account via clicking the link sent to you when you signed up<br /><br />
                                        You can also click the button below to resend verification link to <span>{this.state.username}</span>
                                    </p>
                                    <TimerButton className='button-1' text='Resend' disabledText='You can resend' onClick={this.SendEmailVerification} time={10} />
                                </div>
            return <Messagebox open={true} type='info' buttonText='Log out' content={content} close={this.Logout} />
        }
        else if(!this.state.showContent)
            return <CustomLoader type='Oval' message='Loading Data' color='var(--color-red-dark)'/>
        return  <div id='Dashboard'>
                        <Switch>
                            <Route exact path="/dashboard" render={(props)=> <Shop {...props} brandInfo={this.state.brandInfo} select={this.SelectBrand} CountryFilter={this.ChangeCountryFilter} CategoryFilter={this.ChangeCategoryFilter} itemsPerPage={this.state.isMobile?4:8}/>}/>
                            <Route exact path="/dashboard/map" render={(props)=> <Shop {...props} brandInfo={this.state.brandInfo} select={this.SelectBrand} CountryFilter={this.ChangeCountryFilter} CategoryFilter={this.ChangeCategoryFilter}/>}/>
                            <Route exact path="/dashboard/payment" render={(props)=> <Payment {...props} brandInfo={this.state.selectedBrand} GotoPay={this.GotoPay} maxCreditRate={this.state.promoInfo.rate} availableCredit={this.state.promoInfo.amount}/>}/>
                            <Route exact path="/dashboard/checkout" render={(props)=> <Checkout {...props} paymentInfo={this.state.paymentInfo} screenWidth={this.state.screenWidth} kycVerified={this.state.kycVerified} promoInfo={this.state.promoInfo} updateAfterPay={this.GetPromo}/>}/>
                            <Route exact path="/dashboard/account" render={(props)=> <Account {...props} username={this.state.username} kycVerified={this.state.kycVerified} kycCountry={this.state.kycCountry} promoInfo={this.state.promoInfo} Logout={this.Logout} />}/>
                            <Route exact path="/dashboard/identity" render={(props)=> <Identity {...props}  />}/>
                        </Switch>
                        <Menu type={this.state.menuAvailable?0:-1} kyc={this.state.kycVerified} />
                    </div>
    }
}

export default Dashboard


function PromotionParse(rawData){
    let temp = rawData.result[0]                               
    if(!temp)
        return {
            amount: 0,
            code: null,
            rate: 0
        }
    return {
        amount: temp.amount/100,
        code: temp.code,
        rate: Number(temp.discount)
    }
}

function BrandParse(rawData){
    let newArray = rawData.map(item=>{
        let country = currencyToCountry[codeToCurrency[item.country]]
        if(item.denominations.indexOf('-')!== -1){
            let min = Number(item.denominations.split('-').shift())/100
            let max = Number(item.denominations.split('-').pop())/100
            return {index: item.index, code: item.internal_id, name: item.brand_name, country: country, min: min, max: max}
        }
        else{
            let array = item.denominations.split(' ').map(item=>Number(item)/100)
            return {index: item.index, code: item.internal_id, name: item.brand_name, country: country, array: array}
        }
    })
    newArray.sort((a, b)=>a.index - b.index)
    return newArray
}


