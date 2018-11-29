import React from 'react'
import {POSTAPI} from '../../../https'
import Messagebox from '../../../Utilities/Message'

class Login extends React.Component{
    constructor(props){
        super(props)
        this.userRef = React.createRef()
        this.passRef = React.createRef()
        this.state={
            showPassword: true,
            openMessage: false,
            message: null
        }
    }
    Submit = (event)=>{
        event.preventDefault()
        let userElement = event.target['login-username']
        let passElement = event.target['login-password']
        if(!userElement.validity.valid){
            userElement.classList.add('Checked')
            this.setState({
                openMessage: true,
                message: 'need valid email'
            })
        }
        else if(!passElement.validity.valid){
            passElement.classList.add('Checked')
            this.setState({
                openMessage: true,
                message: 'Password should be Alphanumeric only'
            })
        }
        else{
            let body = {
                username: userElement.value,
                password: passElement.value
            }
            POSTAPI('public/login', body).then(()=>{
                this.setState({
                    message: null
                }, this.props.login)
            }).catch(error=>this.setState({openMessage: true, message: error.statusCode === 401?'wrong credentiail':'Please Try Again'}))
        }
    }
    render(){
        return  <div id='Login'>
                        <div className='Title'>
                            <i className="fas fa-user-circle"></i>
                            <p>Log Into Account</p>
                        </div>
                        <form id='form-1' onSubmit={(event)=>this.Submit(event)} noValidate>
                            <div className='Inline-Input'>
                                <label htmlFor='login-username'><i className="fas fa-user-tie"></i></label>
                                <input ref={this.userRef} id='login-username' name='login-username' type='email' maxLength='24' placeholder='Your Email Address' required/>
                                <span className='Symbol' onClick={()=>this.userRef.current.value=""}>
                                    <i className="fas fa-backspace"></i>
                                </span>
                            </div>
                            <div className='Inline-Input'>
                                <label htmlFor='login-password'><i className="fas fa-key"></i></label>
                                <input ref={this.passRef} id='login-password' name='login-password' type={this.state.showPassword?'password':'text'} 
                                    maxLength='24' pattern='^[0-9A-z]+$' placeholder='Your Password' required autoComplete="on"/>
                                <span className='Symbol' onClick={()=>this.setState(prevState=>({showPassword: !prevState.showPassword}))}>
                                    {this.state.showPassword?<i className="fas fa-eye-slash"></i>:<i className="fas fa-eye"></i>}
                                </span>
                            </div>  
                        </form>
                        <Messagebox open={this.state.openMessage} type='error' buttonText='Close' content={this.state.message} close={()=>this.setState({openMessage: false})} />
                    </div>
    }
}

export default Login