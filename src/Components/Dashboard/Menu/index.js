import React from 'react'
import {NavLink} from 'react-router-dom'
import LOGO from '../../../Media/Images/Logo.png'
import './index.css'

class Menu extends React.Component{
    
    render(){
        switch(this.props.type){
            case 0:
                return <div id='Menu'>
                            <div id='Menu-Left'>
                                <NavLink exact to="/dashboard/wallet" activeClassName="Active">
                                    <i className="fas fa-coins"></i> 
                                    <span>Wallet</span>
                                </NavLink>
                            </div>
                            <div id='Menu-Center'>
                                <NavLink exact to="/dashboard" activeClassName="Active">
                                    <img src={LOGO} alt=""/>
                                    <span>Shop</span>
                                </NavLink>
                            </div>
                            <div id='Menu-Right'>
                                <NavLink exact to="/dashboard/account" activeClassName="Active">
                                    <i className="fas fa-user-alt"></i>
                                    <span>Account</span>
                                </NavLink>
                                {this.props.kyc?null:<i className="fas fa-exclamation-circle KYC"></i>}
                            </div>
                        </div>
            case 1:
                return <div id='Menu' className='Shopping'>
                            <div id='Menu-Left'>
                                <p disabled>
                                    <i className="fas fa-coins"></i> 
                                    <span>Wallet</span>
                                </p>
                            </div>
                            <div id='Menu-Center' onClick={this.props.onClick}>
                                <p>BUY</p>
                            </div>
                            <div id='Menu-Right'>
                                <p>
                                    <i className="fas fa-user-alt"></i>
                                    <span>Account</span>
                                </p>
                            </div>
                        </div>
            default:
                return null
        }
    }
}

export default Menu