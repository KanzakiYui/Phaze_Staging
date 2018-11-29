import React from 'react'
import './index.css'
import {GetAPI} from '../../https'

class EmailVerify extends React.Component{
    constructor(props){
        super(props)
        this.state={
            status: 0                              // 0 means initial, 1 means failed, 2 means succeed
        }
    }
    componentDidMount(){
        let code = this.props.match.params.code
        GetAPI('public/verify_email_token/token/'+code).then(()=>{
            this.setState({status: 2})
            return
        }).catch(()=>{
            this.setState({status: 1})
            return
        })
    }
    render(){
        let status = this.state.status
        switch(status){
            case 1:
                return  <div className="EmailVerify Fail">
                                <p className="Title">Verification Failed</p>
                                <p>This link is invalid or expired</p>
                                <button className="button-1" onClick={()=>this.props.history.push('/')}>Phaze App</button>
                            </div>
            case 2:
                return  <div className="EmailVerify Success">
                                <p className="Title">Verification Succeed</p>
                                <p>The account linked to your email is actived</p>
                                <button className="button-1" onClick={()=>this.props.history.push('/Login')}>Login</button>
                            </div>
            default:
                return  null
        }
    }
}

export default EmailVerify