import React from 'react'
import './index.css'
import Messagebox from '../../../../Utilities/Message'
import {POSTAPI} from '../../../../https'

class Phone extends React.Component{
    constructor(props){
        super(props)
        this.phoneRef = React.createRef()
        this.state={
            openError: false,
            errorMessage: null,
            phone: "",
            phoneSent: false,
            code: ""
        }
    }
    OnPhoneChange = (event)=>{
        let value = event.target.value
        if(isNaN(Number(value.slice(-1))))
            return
        this.setState({
            phone: value
        })
    }
    OnCodeChange = (event)=>{
        let value = event.target.value
        if(isNaN(Number(value.slice(-1))))
            return
        this.setState({
            code: value
        })
    }
    SubmitPhone = (event) =>{
        event.preventDefault()
        let phoneElement = event.target['identity-phone']
        if(!phoneElement.validity.valid){
            phoneElement.classList.add('Checked')
            this.setState({
                openError: true,
                errorMessage: 'Invalid Phone Number'
            })
        }
        else{
            let value = phoneElement.value
            POSTAPI('users/send_verify_sms', {phone_number: value}).then(()=>{
                this.setState({
                    phoneSent: true
                })
                return null
            }).catch(error=>{
                if(error.statusCode === 401)
                    this.props.Cancel()
                else
                    this.setState({
                        openError: true,
                        errorMessage: error.statusCode === 422? 'Invalid Phone Number' : 'Internal Errors Happen'
                    })
            })
        }
    }
    SubmitCode = (event)=>{
        event.preventDefault()
        let codeElement = event.target['identity-phone-code']
        if(!codeElement.validity.valid){
            codeElement.classList.add('Checked')
            this.setState({
                openError: true,
                errorMessage: 'Invalid Code'
            })
        }
        else{
            let value = codeElement.value
            POSTAPI('users/verify_sms', {phone_number: this.state.phone, code: value}).then(response=>{
                this.props.GoNext()
            }).catch(error=>{
                if(error.statusCode === 401)
                    this.props.Cancel()
                else
                    this.setState({
                        openError: true,
                        errorMessage: error.statusCode === 400? 'Invalid Code' : 'Internal Errors Happen'
                    })
            })
        }
    }
    render(){
        if(this.state.phoneSent)
            return  <div id='Identity-Content' className='Identity-Phone'>
                            <p className='Title'>2. Phone in {this.props.country}</p>
                            <p className='Description'>Please type code you received in that phone below</p>
                            <p className='Note'>You can click the below RESEND button to retry if you didn't receive it</p>
                            <form id='Idenity-Phone-Form' onSubmit={(event)=>this.SubmitCode(event)} noValidate>
                                <div className='Inline-Input'>
                                    <label htmlFor='identity-phone-code'><i className="fas fa-barcode"></i></label>
                                    <input ref={this.phoneRef} id='identity-phone-code' name='identity-phone-code' type="text" pattern='^[0-9]{4,}$' maxLength="4" placeholder='Your Code' required value={this.state.code} onChange={(event)=>this.OnCodeChange(event)}/>
                                    <span className='Symbol' onClick={()=>this.phoneRef.current.value=""}>
                                        <i className="fas fa-backspace"></i>
                                    </span>
                                </div>
                                <button type='submit' className='button-1'>Confirm</button>
                            </form>
                            <button className='button-2' onClick={()=>this.setState({phoneSent: false})}>Resend</button>
                            <Messagebox open={this.state.openError} type='error' buttonText='Close' content={this.state.errorMessage} close={()=>this.setState({openError: false})} />
                        </div>
        return  <div id='Identity-Content' className='Identity-Phone'>
                        <p className='Title'>2. Phone in {this.props.country}</p>
                        <p className='Description'>Please input your available phone number in selected country and prepare to receive SMS verification code in that phone.</p>
                        
                        <form id='Idenity-Phone-Form' onSubmit={(event)=>this.SubmitPhone(event)} noValidate>
                            <div className='Inline-Input'>
                                <label htmlFor='identity-phone'><i className="fas fa-mobile-alt"></i></label>
                                <input ref={this.phoneRef} id='identity-phone' name='identity-phone' type="text" pattern='^[0-9]{10,}$' maxLength="10" placeholder='Your Phone' required value={this.state.phone} onChange={(event)=>this.OnPhoneChange(event)}/>
                                <span className='Symbol' onClick={()=>this.phoneRef.current.value=""}>
                                    <i className="fas fa-backspace"></i>
                                </span>
                            </div>
                            <button type='submit' className='button-1'>Confirm</button>
                        </form>
                        <button className='button-2' onClick={this.props.GoBack}>Go Back</button>
                        <Messagebox open={this.state.openError} type='error' buttonText='Close' content={this.state.errorMessage} close={()=>this.setState({openError: false})} />
                    </div>
    }
}

export default Phone