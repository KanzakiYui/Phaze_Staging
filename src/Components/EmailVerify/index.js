import React from 'react'
import './index.css'
import {GetAPI} from '../../https'
import CustomLoader from '../../Utilities/CustomLoader'

class EmailVerify extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            status: 0                                               // 0 = initial, 1 = error, 2 = success
        }
    }
    componentDidMount(){
        let code = this.props.match.params.code
        GetAPI('public/verify_email_token/token/'+code).then(()=>this.setState({status: 2})).catch(()=>this.setState({status: 1}))
    }
    render(){
        switch(this.state.status){
            case 0:
                return <CustomLoader message='please wait...' type='Oval' color='var(--color-red-normal)' />
            case 1:
                return  <div id='EmailVerify'>
                                <p>Verify Failed!</p>
                                <p>This link is incorrect or no longer valid.</p>
                                <button className='button-1' onClick={()=>this.props.history.push('/')}>Go to Login<i className="fas fa-arrow-right"></i></button>
                            </div>
            case 2:
                return  <div id='EmailVerify'>
                                <p>Verify Succeed!</p>
                                <p>Your account is verified and most of features are now actived.</p>
                                <button className='button-1' onClick={()=>this.props.history.push('/')}>Go to Login<i className="fas fa-arrow-right"></i></button>
                            </div>
            default:
                return null
        }
    }
}

export default EmailVerify