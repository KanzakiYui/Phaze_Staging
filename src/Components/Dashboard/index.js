import React from 'react'
import './index.css'
import CustomLoader from '../../Utilities/CustomLoader'
import {CheckAuth, GetAPI} from '../../https'
import Loading from '../Loading'
import Loadable from 'react-loadable'
import {codeToCurrency, currencyToCountry} from '../../constants'
import {Switch, Route, NavLink} from 'react-router-dom'
import LOGO from '../../Media/Images/Logo.png'

const Notverified = Loadable({ loader: () => import('./Notverified'), loading: Loading, delay: 1000, render(loaded, props){ let Component = loaded.default; return <Component {...props}/>} })
const Shop = Loadable({ loader: () => import('./Shop'), loading: Loading, delay: 1000, render(loaded, props){ let Component = loaded.default; return <Component {...props}/>} })

class Dashboard extends React.Component{
    constructor(props){
        super(props)
        this.state={
            location: 'shop',                                               // shop, wallet, account
            menuActive: false,
            username: null,
            emailVerified: false,
            kycVerified: false,
            kycCountry: null,
            promoInfo: null,
            brandInfo: null,
            showContent: false,                                  // when everything is done, show content
            openSearch: false,
        }
    }
    componentDidMount(){
        this.UserCheck()
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth'})
    }
    UserCheck = async () =>{
        CheckAuth().then(response=>{
            console.log(response)
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
    GetPromo = ()=>{
        GetAPI('users/list_coupons').then(response=>{
            this.setState({promoInfo: PromotionParse(response)}, this.GetBrands)
            return null
        }).catch(this.Logout)
    }
    GetBrands = ()=>{
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
        console.log(value)
        /*
        let brand = this.state.brandInfo.filter(item=>item.code === value)[0]
        this.setState({
            selectedBrand: brand
        },()=>this.props.history.push('/dashboard/payment'))
        */
    }
    render(){
        if(!this.state.showContent)
            return  <CustomLoader type='Oval' message='Loading Data' color='var(--color-red-normal)'/>
        else if(!this.state.emailVerified)
            return  <Notverified Logout={this.Logout}/>
        let subMenu = null
        let menuActive = this.state.menuActive?"Active":""
        if(this.state.location === 'shop')
            subMenu =  <React.Fragment>
                                    <NavLink exact to='/dashboard/' activeClassName="Actived">
                                        <i className="fas fa-th-large"></i>
                                    </NavLink>
                                    <NavLink exact to='/dashboard/map' activeClassName="Actived">
                                        <i className="fas fa-map-marker-alt"></i>
                                    </NavLink> 
                                    <i className="fas fa-search" onClick={()=>this.setState({openSearch: true})}></i>
                                </React.Fragment>
            return  <div id='Dashboard'>
                            <div id='Dashboard-Menu'>
                                <div className='Bar'>
                                    <div className='Controller'>
                                        <i className="fas fa-bars" onClick={()=>this.setState(prevState=>({menuActive: !prevState.menuActive}))}></i>
                                        <span>{this.state.location}</span>
                                    </div>
                                    <div className='SubMenu'>
                                        {subMenu}
                                    </div>
                                    <img src={LOGO} alt="" />
                                </div>
                                <div className={'Panel '+menuActive}>
                                    <NavLink exact to='/dashboard' onClick={()=>this.setState({location: 'shop'})}>Shop</NavLink>
                                    <NavLink exact to='/dashboard/wallet' onClick={()=>this.setState({location: 'wallet'})}>Wallet</NavLink>
                                    <NavLink exact to='/dashboard/account' onClick={()=>this.setState({location: 'account'})}>Account</NavLink>
                                </div>
                            </div>
                            <Switch>
                                <Route exact path="/dashboard" render={(props)=> <Shop {...props} brandInfo={this.state.brandInfo} openSearch={this.state.openSearch} CloseSearch={()=>this.setState({openSearch: false})} Select={this.SelectBrand} />}/>
                                <Route exact path="/dashboard/map" render={(props)=> <Shop {...props} />}/>
                            </Switch>
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