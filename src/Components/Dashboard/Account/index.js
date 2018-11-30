import React from 'react'
import './index.css'
import {GetOther} from '../../../https'
import Scrollbar from 'smooth-scrollbar'
import Messagebox from '../../../Utilities/Message'
import ChangePIN from './ChangePIN'

class Account extends React.Component{
    constructor(props){
        super(props)
        this.state={
            showContent: false,
            location: {
                country: null,
                province: null,
                city: null
            },
            openChangePINBox: false
        }
    }
    componentDidMount(){
        if(!this.props.username){
            this.props.history.push('/dashboard')
            return
        }
        if(Scrollbar.has(document.body))
            Scrollbar.get(document.body).scrollTo(0, 0, 500)
        else
            window.scrollTo(0, 0)
        this.GetLocation()
    }
    GetLocation = ()=>{
        GetOther('https://api.ipdata.co/?api-key=test').then(response=>{
            this.setState({
                location: {
                    country: response.country_name,
                    province: response.region_code,
                    city: response.city
                }
            })
        }).catch(()=>{})
    }
    render(){
        if(!this.state.showContent)
        return  <div id='Account'>
                        <p className='Title'>Account Overview</p>
                        <div id='Account-Info'>
                            <p className='Title'>Personal Information</p>
                            <div>
                                <p><i className="fas fa-envelope-square"></i>E-mail</p>
                                <p>{this.props.username}</p>
                            </div>
                            <div>
                                <p><i className="fas fa-compass"></i>Location</p>
                                <p>
                                    {this.state.location.city}
                                    <span>{this.state.location.province}</span>
                                    {this.state.location.country}
                                </p>
                            </div>
                            <div>
                                <p><i className="fas fa-id-card"></i>Identity</p>
                                {this.props.kycVerified?
                                    <p className='Verified'>{this.props.kycCountry}</p>:
                                    <p className='NeedVerify'>Unverified</p>
                                }
                            </div>
                            <div>
                                <p><i className="fas fa-qrcode"></i>Promo Code</p>
                                <p className='PromoCode'>
                                    {this.props.promoInfo.code?<span>{this.props.promoInfo.code}</span>: 'Not Available'}
                                </p>
                            </div>
                            <div>
                                <p><i className="fas fa-gift"></i>Applicable Rate</p>
                                <p>
                                    {this.props.promoInfo.rate * 100} %
                                </p>
                            </div>
                        </div>
                        <button className='button-1 ChangePIN' onClick={()=>this.setState({openChangePINBox: true})}>Change Password</button>
                        <button className='button-1 Orders' onClick={()=>this.props.history.push('/dashboard/orders')}>View Order History</button>
                        {this.props.kycVerified?null:<button className='button-1 KYC' onClick={()=>this.props.history.push('/dashboard/identity')}>Verify Identity</button>}
                        <button className='button-2 Logout' onClick={this.props.Logout}>Logout</button>
                        <Messagebox open={this.state.openChangePINBox} type='input' buttonText='Close' content={<ChangePIN onError={this.props.Logout}/>} close={()=>this.setState({openChangePINBox: false})} />
                    </div>
    }
}

export default Account