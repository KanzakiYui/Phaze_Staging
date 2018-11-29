import React from 'react'
import './index.css'
import {POSTAPI} from '../../../https'
import Messagebox from '../../../Utilities/Message'

class Forgot extends React.Component{
    constructor(props){
        super(props)
        this.emailRef = React.createRef()
        this.codeRef = React.createRef()
        this.passRef = React.createRef()
        this.passConfirmRef = React.createRef()
        this.state={
            openMessage: false,
            message: null,
            emailSent: this.props.token?true:false,
            showPassword: true,
            success: false,
        }
    }
    PreFormSubmit = (event)=>{
        event.preventDefault()
        if(this.state.success){                                                     // work around with a werid bug?
            this.setState({ success: false })
            return
        }
        let emailElement = event.target['forgot-email']
        if(!emailElement.validity.valid){
            emailElement.classList.add('Checked')
            this.setState({
                openMessage: true,
                message: 'need valid email'
            })
        }
        else{
            let body={ email: emailElement.value }
            POSTAPI('public/reset_password', body).then(response=>{
                this.setState({
                    emailSent: true
                })
            }).catch(error=>this.setState({openMessage: true, message: error.statusCode === 400?'User Does Not Exist':'Please Try Again'}))
        }
    }
    Submit = (event)=>{
        event.preventDefault()
        let codeElement = event.target['forgot-code']
        let passElement = event.target['forgot-password']
        let passConfirmElement = event.target['forgot-passwordConfirm']
        if(codeElement && !codeElement.validity.valid){
            codeElement.classList.add('Checked')
            this.setState({
                openMessage: true,
                message: 'code is required'
            })
        }
        else if(!passElement.validity.valid || !passConfirmElement.validity.valid){
            passElement.classList.add('Checked')
            passConfirmElement.classList.add('Checked')
            this.setState({
                openMessage: true,
                message: 'Two passwords should be identical and only alphanumeric is allowed. Minimum length is 8'
            })
        }
        else{
            let body={
                token: codeElement?codeElement.value:this.props.token,
                password: passElement.value
            }
            POSTAPI('public/reset_password_verify', body).then(()=>{
                this.setState({
                    emailSent: false,
                    openMessage: true,
                    success: true,
                    message: 'Your Password is Reset'
                })
            }).catch(error=>this.setState({openMessage: true, message: error.statusCode === 400?'Code Invalid or Expired':'Please Try Again'}))
        }
    }

    Refresh = ()=>{
        this.setState({emailSent: false, showPassword: true},()=>this.emailRef.current.classList.remove('Checked'))
    }
    render(){
        let form = null
        let tokenPart = null
        if(!this.props.token)
            tokenPart = <React.Fragment>
                                    <p className='Goback'>
                                        <span onClick={()=>this.setState({emailSent: false})}>
                                            <i className="fas fa-arrow-left"></i> Go Back
                                        </span>
                                    </p>
                                    <div className='Inline-Input'>
                                        <label htmlFor='forgot-code'><i className="fas fa-barcode"></i></label>
                                        <input ref={this.codeRef} id='forgot-code' name='forgot-username' type='text' placeholder='Verification Code' required spellCheck="false" defaultValue={this.props.token}/>
                                        <span className='Symbol' onClick={()=>this.codeRef.current.value=""}>
                                            <i className="fas fa-backspace"></i>
                                        </span>
                                    </div>
                                </React.Fragment>
        if(!this.state.emailSent)
            form = <form id='pre-form' onSubmit={(event)=>this.PreFormSubmit(event)} noValidate>
                            <div className='Inline-Input'>
                                <label htmlFor='forgot-email'><i className="fas fa-envelope"></i></label>
                                <input ref={this.emailRef} id='forgot-email' name='forgot-email' type='email' maxLength='24' placeholder='Your Email Address' required/>
                                <span className='Symbol' onClick={()=>this.emailRef.current.value=""}>
                                    <i className="fas fa-backspace"></i>
                                </span>
                            </div>
                            <button type='submit' className='button-1'>Send Email</button>
                        </form>
        else
            form = <form id='form-0' onSubmit={(event)=>this.Submit(event)} noValidate disabled>
                            {tokenPart}
                            <div className='Inline-Input'>
                                <label htmlFor='forgot-password'><i className="fas fa-key"></i></label>
                                <input ref={this.passRef} id='forgot-password' name='forgot-password' type={this.state.showPassword?'password':'text'} 
                                    maxLength='24' pattern='^[0-9A-z]{8,}$' placeholder='New Password' required autoComplete="on"
                                    onChange={(event)=>this.passConfirmRef.current.pattern=event.target.value}
                                />
                                <span className='Symbol' onClick={()=>this.setState(prevState=>({showPassword: !prevState.showPassword}))}>
                                    {this.state.showPassword?<i className="fas fa-eye-slash"></i>:<i className="fas fa-eye"></i>}
                                </span>
                            </div>
                            <div className='Inline-Input'>
                                <label htmlFor='forgot-passwordConfirm'><i className="fas fa-key"></i></label>
                                <input ref={this.passConfirmRef} id='forgot-passwordConfirm' name='forgot-passwordConfirm' type={this.state.showPassword?'password':'text'} 
                                    maxLength='24' pattern='^[0-9A-z]{8,}$' placeholder='Confirm Password' required autoComplete="on"
                                />
                                <span className='Symbol' onClick={()=>this.setState(prevState=>({showPassword: !prevState.showPassword}))}>
                                    {this.state.showPassword?<i className="fas fa-eye-slash"></i>:<i className="fas fa-eye"></i>}
                                </span>
                            </div>
                        </form>
        return  <div id='Forgot'>
                        <div className='Title'>
                            <i className="fas fa-unlock-alt"></i>
                            <p>Restore Password</p>
                        </div>
                        {form}
                        <Messagebox open={this.state.openMessage} type={this.state.success?'success':'error'} buttonText='Close' content={this.state.message} close={()=>this.setState({openMessage: false})} />
                    </div>
    }
}

export default Forgot