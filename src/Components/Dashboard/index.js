import React from 'react'
import './index.css'
import CustomLoader from '../../Utilities/CustomLoader'
import {CheckAuth, GetAPI} from '../../https'
import Loading from '../Loading'
import Loadable from 'react-loadable'

const Notverified = Loadable({ loader: () => import('./Notverified'), loading: Loading, delay: 1000, render(loaded, props){ let Component = loaded.default; return <Component {...props}/>} })

class Dashboard extends React.Component{
    constructor(props){
        super(props)
        this.state={
            username: null,
            emailVerified: false,
            kycVerified: false,
            kycCountry: null,
            promoInfo: null,
            brandInfo: null,
            showContent: false,                                  // when everything is done, show content
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

    }
    Logout = ()=>{
        GetAPI('public/logout').then(()=>{
            this.props.history.push('/')
            return null
        }).catch(()=>{})
    }
    render(){
        if(!this.state.showContent)
            return  <CustomLoader type='Oval' message='Loading Data' color='var(--color-red-normal)'/>
        else if(!this.state.emailVerified)
            return  <Notverified Logout={this.Logout}/>
        else
            return null
    }
}

export default Dashboard