import React from 'react'
import './index.css'
import {POSTAPI} from '../../../https'
import Messagebox from '../../../Utilities/Message'
import ShakeImage from '../../../Media/Images/Credential/Shake.png'

class Signup extends React.Component{
    constructor(props){
        super(props)
        this.userRef = React.createRef()
        this.passRef = React.createRef()
        this.passConfirmRef = React.createRef()
        this.promoRef = React.createRef()
        this.state={
            showPassword: true,
            openMessage: false,
            message: null,
            success: false,
            condifitonChecked: false,
        }
    }
    Submit = (event)=>{
        event.preventDefault()
        let userElement = event.target['signup-username']
        let passElement = event.target['signup-password']
        let passConfirmElement = event.target['signup-passwordConfirm']
        let promoElement = event.target['signup-promo']
        if(!userElement.validity.valid){
            userElement.classList.add('Checked')
            this.setState({
                openMessage: true,
                message: 'need valid email'
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
        else if(!promoElement.validity.valid){
            promoElement.classList.add('Checked')
            this.setState({
                openMessage: true,
                message: 'need promo code to signup'
            })
        }
        else if(!this.state.condifitonChecked)
            this.setState({
                openMessage: true,
                message: 'You must accept condition'
            })
        else{
            let body={
                username: userElement.value,
                password: passElement.value,
                promo: promoElement.value
            }
            POSTAPI('public/signup', body).then(()=>{
                this.setState({
                    openMessage: true,
                    success: true,
                    message: 'Account is created with credit\nCheck your mailbox to active the account'
                },this.Reset)
            }).catch(error=>{
                let message = 'Please Try Again'
                if(error.statusCode === 403)
                    message = 'This promo code is expired or invalid'
                else if(error.statusCode === 400)
                    message = 'This email is linked to an existing account'
                this.setState({
                    openMessage: true,
                    message: message
                })
            })
        }
    }
    OpenTerms = ()=>{
        import('../../../Media/Files/Terms.pdf').then(file=>window.open(file.default, '_blank'))
    }
    Reset = ()=>{
        let form = document.getElementById('form-2')
        form.reset()
        let elements = form.elements
        for(let i=0; i<elements.length; i++)
            elements[i].classList.remove('Checked')
    }
    render(){
        return  <div id='Signup'>
                        <div className='Title'>
                            <i className="fas fa-user-plus"></i>
                            <p>Create New Account</p>
                        </div>
                        <form id='form-2' onSubmit={(event)=>this.Submit(event)} noValidate>
                            <div className='Inline-Input'>
                                <label htmlFor='signup-username'><i className="fas fa-envelope-square"></i></label>
                                <input ref={this.userRef} id='signup-username' name='signup-username' type='email' maxLength='24' placeholder='Your Email Address' required/>
                                <span className='Symbol' onClick={()=>this.userRef.current.value=""}>
                                    <i className="fas fa-backspace"></i>
                                </span>
                            </div>
                            <div className='Inline-Input'>
                                <label htmlFor='signup-password'><i className="fas fa-key"></i></label>
                                <input ref={this.passRef} id='signup-password' name='signup-password' type={this.state.showPassword?'password':'text'} 
                                    maxLength='24' pattern='^[0-9A-z]{8,}$' placeholder='Password' required autoComplete="on"
                                    onChange={(event)=>this.passConfirmRef.current.pattern=event.target.value}
                                />
                                <span className='Symbol' onClick={()=>this.setState(prevState=>({showPassword: !prevState.showPassword}))}>
                                    {this.state.showPassword?<i className="fas fa-eye-slash"></i>:<i className="fas fa-eye"></i>}
                                </span>
                            </div>
                            <div className='Inline-Input'>
                                <label htmlFor='signup-passwordConfirm'><i className="fas fa-key"></i></label>
                                <input ref={this.passConfirmRef} id='signup-passwordConfirm' name='signup-passwordConfirm' type={this.state.showPassword?'password':'text'} 
                                    maxLength='24' pattern='^[0-9A-z]{8,}$' placeholder='Confirm Password' required autoComplete="on"
                                />
                                <span className='Symbol' onClick={()=>this.setState(prevState=>({showPassword: !prevState.showPassword}))}>
                                    {this.state.showPassword?<i className="fas fa-eye-slash"></i>:<i className="fas fa-eye"></i>}
                                </span>
                            </div>
                            <div className='Inline-Input'>
                                <label htmlFor='signup-promo'><i className="fas fa-gift"></i></label>
                                <input ref={this.promoRef} id='signup-promo' name='signup-promo' type='text' maxLength='14' pattern='^[0-9A-z]+$' placeholder='Promo Code' required defaultValue={this.props.code} spellCheck='false'/>
                                <span className='Symbol' onClick={()=>this.promoRef.current.value=""}>
                                    <i className="fas fa-backspace"></i>
                                </span>
                            </div>
                            <div className="CheckCondition">
                                <input id="ConditionCheck" type="checkbox" onChange={()=>this.setState(prevState=>({condifitonChecked: !prevState.condifitonChecked}))} />
                                <label htmlFor="ConditionCheck">
                                    <span></span>
                                </label>
                                <span>I accept the <i onClick={this.OpenTerms}>Terms & Condition</i></span>
                            </div>
                        </form>
                        <Messagebox open={this.state.openMessage} type={this.state.success?'success':'error'} buttonText='Close' content={this.state.message} close={()=>this.setState({openMessage: false})} />
                        <img src={ShakeImage} id='Signup-Background' alt=""/>
                    </div>
    }
}

export default Signup