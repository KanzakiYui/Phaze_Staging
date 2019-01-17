import React from 'react'
import './index.css'

class WalletDetail extends React.Component{
    constructor(props){
        super(props)
        this.walletName = this.props.location.state
        this.kycVerified = this.props.kycVerified
    }
    componentDidMount(){
        if(!this.walletName || !this.kycVerified){
            this.props.history.push('/dashboard')
            return
        }
    }
    render(){
        if(!this.walletName || !this.kycVerified)
            return null
        return  <div id='Wallet-Detail'>
        
                    </div>
    }
}

export default WalletDetail