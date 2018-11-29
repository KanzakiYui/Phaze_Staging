import React from 'react'
import './index.css'
import LOGO from '../../Utilities/Logo'

class Initial extends React.Component{
    GetStarted = ()=>{
        /*
        if(window.screen.width < 768){
            let root = document.documentElement
            let fullscreen = root.requestFullScreen || root.webkitRequestFullScreen || root.mozRequestFullScreen || root.oRequestFullscreen || root.msRequestFullscreen
            try{
                fullscreen.call(root)
            }catch(error){}
        }
        */
        this.props.history.push('/credential')
    }
    render(){
        return  <div id='Initial'>
                        <LOGO />
                        <p className='GeneralTitle'>Welcome to Phaze</p>
                        <div className='Slogan'>
                            <div className='SloganSnippet'>
                                <div><i className="fas fa-cart-plus"></i></div>
                                <p><span>Crypto Usable</span> at 150,000+ Online or In-store Places</p>
                                <i className="fas fa-check-circle"></i>
                            </div>
                            <div className='SloganSnippet'>
                                <div><i className="fas fa-store"></i></div>
                                <p><span>Merchant Rewards</span> Make It Better The Fiat Spending</p>
                                <i className="fas fa-check-circle"></i>
                            </div>
                            <div className='SloganSnippet'>
                                <div><i className="fas fa-money-bill-wave"></i></div>  
                                <p><span>Low Fees</span> As Low As 0% Based On Spending Profile</p>
                                <i className="fas fa-check-circle"></i>
                            </div>
                            <div className='SloganSnippet'>
                                <div><i className="fab fa-cc-amazon-pay"></i></div>  
                                <p><span>Instantly Convert and Receive</span> Fiat Digital Gift Cards</p>
                                <i className="fas fa-check-circle"></i>
                            </div>
                        </div>
                        <button className='button-1' onClick={this.GetStarted}>Get Started</button>
                    </div>
    }
}

export default Initial