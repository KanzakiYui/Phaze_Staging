import React from 'react'
import './index.css'
import Messagebox from '../../../../Utilities/Message'
import {POSTAPI} from '../../../../https'

class ChangePIN extends React.Component{
    constructor(props){
        super(props)
        this.newPinRef = React.createRef()
        this.newPinConfirmRef = React.createRef()
        this.state={
            showoldPassword: false,
            shownewPassword: false,
            openMessage: false,
            message: null,
            success: false,
        }
    }
    Submit = (event)=>{
        event.preventDefault()
        let oldElement = event.target['changepin-old']
        let passElement = event.target['changepin-new']
        let passConfirmElement = event.target['changepin-new-confirm']
        if(!oldElement.validity.valid){
            oldElement.classList.add('Checked')
            this.setState({
                openMessage: true,
                message: 'Current password is required'
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
            let body ={
                old_password: oldElement.value,
                new_password: passElement.value
            }
            POSTAPI('users/change_password', body).then(()=>{
                this.setState({
                    success: true
                })
            }).catch(error=>{
                if(error.statusCode === 401)
                    this.props.onError()
                else
                    this.setState({
                        openMessage: true,
                        message: error.statusCode === 400?'Current Password is Wrong':'Failed to Change'
                    })
            })
        }
    }
    render(){
        if(this.state.success)
            return <p id='ChangePIN-Success'>Password is Changed!</p>
        return  <div id='ChangePIN'>
                        <p className='Title'>Change Password</p>
                        <form id='ChangePINForm' onSubmit={(event)=>this.Submit(event)} noValidate>
                            <label>
                                <i className="fas fa-unlock-alt"></i>
                                <input id='changepin-old' name='changepin-old' type={this.state.showoldPassword?"text":"password"}
                                    maxLength='24' placeholder='Current Password' required autoComplete="on" />
                                <span className='Symbol' onClick={()=>this.setState(prevState=>({showoldPassword: !prevState.showoldPassword}))}>
                                    {!this.state.showoldPassword?<i className="fas fa-eye-slash"></i>:<i className="fas fa-eye"></i>}
                                </span>
                            </label>
                            <label>
                                <i className="fas fa-lock"></i>
                                <input ref={this.newPinRef} id='changepin-new' name='changepin-new' type={this.state.shownewPassword?"text":"password"}
                                    maxLength='24' pattern='^[0-9A-z]{8,}$' placeholder='New Password' required autoComplete="on"
                                    onChange={(event)=>this.newPinConfirmRef.current.pattern=event.target.value}
                                />
                                <span className='Symbol' onClick={()=>this.setState(prevState=>({shownewPassword: !prevState.shownewPassword}))}>
                                    {!this.state.shownewPassword?<i className="fas fa-eye-slash"></i>:<i className="fas fa-eye"></i>}
                                </span>
                            </label>
                            <label>
                                <i className="fas fa-lock"></i>
                                <input ref={this.newPinConfirmRef} id='changepin-new-confirm' name='changepin-new-confirm' type={this.state.shownewPassword?"text":"password"}
                                    maxLength='24' pattern='^[0-9A-z]{8,}$' placeholder='Confrim New Password' required autoComplete="on" 
                                />
                                <span className='Symbol' onClick={()=>this.setState(prevState=>({shownewPassword: !prevState.shownewPassword}))}>
                                    {!this.state.shownewPassword?<i className="fas fa-eye-slash"></i>:<i className="fas fa-eye"></i>}
                                </span>
                            </label>
                            <button type='submit' className='button-1'>Confirm</button>
                        </form>
                        <Messagebox open={this.state.openMessage} type='error' buttonText='Close' content={this.state.message} close={()=>this.setState({openMessage: false})} />
                    </div>
    }
}

export default ChangePIN