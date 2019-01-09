import React from 'react'
import './index.css'
import {POSTAPI} from '../../../https'
import Loader from 'react-loader-spinner'
import {front, back} from './mockData'

class Identity extends React.Component{
    constructor(props){
        super(props)
        this.state={
            status: 0,                                          // 0 = legal, 1 = name, 2 = citizen, 3 = phone, 4 = code, 5 = ID
            first_name: 'Jan',
            last_name: 'Kowalski',
            country_code: 'POL',
            phoneError: false,
            phone: null,
            codeError: false,
            uploadStatus: 0,                                // 0 = initial, 1 = uploading, 2 = uploaded
            file: null,
            front_image: null,
        }
    }
    componentDidMount(){
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth'})
    }
    GoBack = ()=>{
        if(this.state.status === 0)
            this.props.history.goBack()
        else
            this.setState({
                status: this.state.status - 1
            })
    }
    SubmitName = (event)=>{
        event.preventDefault()
        let firstEl = event.target['identity-first']
        let lastEl = event.target['identity-last']
        if(!firstEl.validity.valid || !lastEl.validity.valid){
            firstEl.classList.add('Checked')
            lastEl.classList.add('Checked')
        }
        else
            this.setState({
                first_name: firstEl.value,
                last_name: lastEl.value,
                status: 2
            })
    }
    SubmitCountry = (event)=>{
        event.preventDefault()
        let countryEl = event.target['identity-country']
        if(!countryEl.validity.valid)
            countryEl.classList.add('Checked')
        else
            this.setState({
                country_code: countryEl.value,
                status: 3
            })
    }
    SubmitPhone = (event)=>{
        event.preventDefault()
        let phoneEl = event.target['identity-phone']
        this.setState({phoneError: false},()=>{
            if(!phoneEl.validity.valid)
                phoneEl.classList.add('Checked')
            else
                POSTAPI('users/send_verify_sms', {phone_number: phoneEl.value}).then(()=>{
                    this.setState({
                        phone: phoneEl.value,
                        status: 4
                    })
                    phoneEl.value=""                            // Edge case handle
                }).catch(error=>{
                    if(error.statusCode === 401)
                        this.props.history.push('/')
                    else
                        this.setState({phoneError: true})
                })
        })
    }
    SubmitCode = (event)=>{
        event.preventDefault()
        let codeEl = event.target['identity-code']
        this.setState({codeError: false},()=>{
            if(!codeEl.validity.valid)
                codeEl.classList.add('Checked')
            else
                POSTAPI('users/verify_sms', {phone_number: this.state.phone, code: codeEl.value}).then(()=>{
                    this.setState({
                        status: 5
                    })
                }).catch(error=>{
                    if(error.statusCode === 401)
                        this.props.history.push('/')
                    else
                        this.setState({codeError: true})
                })
        })
    }
    FileChange=(event)=>{
        let file = event.target.files[0]
        if(!file || file.type.indexOf('image') === -1)
            file = null
        this.setState({
            file: file,
            uploadStatus: file?1:0
        })
        if(file)
            this.ImageProcess(file)
    }
    ImageProcess = (file)=>{
        let reader = new FileReader()
        reader.addEventListener('load', ()=>{
            let data = reader.result
            data = data.slice(data.indexOf("base64,")+7)
            this.setState({
                front_image: data,
                uploadStatus: 2
            })
        })
        reader.readAsDataURL(file)
    }
    Submit = ()=>{
        let body = {
            country_code: this.state.country_code,
            id_type: 'PASSPORT',
            front_image: front,
            back_image: back,
            //front_image: this.state.front_image,
            first_name: this.state.first_name,
            last_name: this.state.last_name
        }
        POSTAPI('users/kyc_check_swiftdil', body).then(response=>{
            console.log(response)
        }).catch(error=>{
            console.log(error)
        })
    }
    render(){
        let content = null
        let statusBar = <div id='Identity-Bar'>
                                    <p className={this.state.status === 1 ? "Active":""}><span></span></p>
                                    <p className={this.state.status === 2 ? "Active":""}><span></span></p>
                                    <p className={(this.state.status === 3 || this.state.status === 4) ? "Active":""}><span></span></p>
                                    <p className={this.state.status === 5 ? "Active":""}><span></span></p>
                                </div>
        let uploadButton = null
        switch(this.state.uploadStatus){
            case 0:
                uploadButton =    <label className='Upload' >
                                                Upload  Photo Page<i className="fas fa-upload"></i>
                                                <input type='file' onChange={(event)=>this.FileChange(event)} accept="image/*"></input>
                                            </label>
                break
            case 1:
                uploadButton =   <button className='button-2'>
                                                Uploading...
                                                <Loader type='Oval' color='var(--color-blue-normal)'/>
                                            </button>
                break
            case 2:
                uploadButton = <button className='button-2'>
                                            Uploaded
                                            <i className="fas fa-check"></i>
                                         </button>
                break
            default:
                uploadButton = null                     
        }
        switch(this.state.status){
            case 0:
                content =     <div id='Identity-Legal'>
                                        <p className='Title'>Legal notice</p>
                                        <p>We need to verify your identity to activate all of your account features. Please make sure that the information you submit is true and accurate.</p>
                                        <p>The process should take just a few minutes to complete. If you exit at any point before completion, you will have to begin again.</p>
                                        <p>We will never store a digital copy of your credential information. However, we will send an encrypted version of your data to a trusted third party to verify your identity.</p>
                                        <button onClick={this.GoBack} className='button-2 Goback'><i className="fas fa-long-arrow-alt-left"></i></button>
                                        <button className='button-1' onClick={()=>this.setState({status: 1})}>continue<i className="fas fa-arrow-right"></i></button>
                                    </div>
                break
            case 1:
                content =     <div id='Identity-Name'>
                                        {statusBar}
                                        <p className='Step-Title'>What is your name?</p>
                                        <form noValidate onSubmit={(event)=>this.SubmitName(event)}>
                                            <div className='Inline-Input'>
                                                <input id='identity-first' name='identity-first' type='text' placeholder='first name' required spellCheck="false"></input>
                                                <label htmlFor='identity-first'>
                                                    <i className="far fa-user"></i>
                                                </label>
                                                <p>first name is required</p>
                                            </div>
                                            <div className='Inline-Input'>
                                                <input id='identity-last' name='identity-last' type='text' placeholder='last name' required spellCheck="false"></input>
                                                <label htmlFor='identity-last'>
                                                    <i className="far fa-user"></i>
                                                </label>
                                                <p>last name is required</p>
                                            </div>
                                            <button onClick={this.GoBack} className='button-2 Goback'><i className="fas fa-long-arrow-alt-left"></i></button>
                                            <button className='button-1' >Next: citizenship<i className="fas fa-arrow-right"></i></button>
                                        </form>
                                    </div>
                break
            case 2:
                content =     <div id='Identity-Name'>
                                        {statusBar}
                                        <p className='Step-Title'>What’s your country of citizenship?</p>
                                        <form noValidate onSubmit={(event)=>this.SubmitCountry(event)}>
                                            <div className='Inline-Input'>
                                                <select id='identity-country' name='identity-country' defaultValue="" required>
                                                    <option value="" disabled>select the country</option>
                                                    <option value='CA'>Canada</option>
                                                    <option value='US'>United States</option>
                                                </select>
                                                <label htmlFor='identity-last'>
                                                    <i className="fas fa-angle-down"></i>
                                                </label>
                                                <p>citizenship is required</p>
                                            </div>
                                            <button onClick={this.GoBack} className='button-2 Goback'><i className="fas fa-long-arrow-alt-left"></i></button>
                                            <button className='button-1' >Next: Phone<i className="fas fa-arrow-right"></i></button>
                                        </form> 
                                    </div>
                break
            case 3:
                content =     <div id='Identity-Phone'>
                                        {statusBar}
                                        <p className='Step-Title'>What’s your phone number?</p>
                                        <form noValidate onSubmit={(event)=>this.SubmitPhone(event)}>
                                            <div className='Inline-Input'>
                                                <input id='identity-phone' name='identity-phone' type='text' pattern='^[0-9]{10,}$' maxLength="10" placeholder='e.g. 6479093231' required spellCheck="false"></input>
                                                <label htmlFor='identity-phone'>
                                                    <i className="fas fa-mobile-alt"></i>
                                                </label>
                                                <p>please enter a valid number</p>
                                            </div>
                                            {this.state.phoneError?
                                                <p className='AuthError'>Please try a different number</p>
                                                :null
                                            }
                                            <button onClick={this.GoBack} className='button-2 Goback'><i className="fas fa-long-arrow-alt-left"></i></button>
                                            <button className='button-2' >SMS<i className="fas fa-arrow-right"></i></button>
                                        </form> 
                                    </div>
                break
            case 4:
                content =     <div id='Identity-Code'>
                                        {statusBar}
                                        <p className='Step-Title'>Type in the code.</p>
                                        <form noValidate onSubmit={(event)=>this.SubmitCode(event)}>
                                            <div className='Inline-Input'>
                                                <input id='identity-code' name='identity-code' type='text' pattern='^[0-9]{4,}$' maxLength="4" placeholder='e.g. 1352' required spellCheck="false" defaultValue=""></input>
                                                <label htmlFor='identity-code'>
                                                    <i className="far fa-comments"></i>
                                                </label>
                                                <p>code is required</p>
                                            </div>
                                            {this.state.codeError?
                                                <p className='AuthError'>Code is incorrect</p>
                                                :null
                                            }
                                            <button onClick={this.GoBack} className='button-2 Goback'><i className="fas fa-long-arrow-alt-left"></i></button>
                                            <button className='button-1' >next: passport<i className="fas fa-arrow-right"></i></button>
                                        </form> 
                                    </div>
                break  
            case 5:
                content =     <div id='Identity-Photo'>
                                        {statusBar}
                                        <p className='Step-Title'>Upload your passport</p>
                                        <p>Please upload an image of the personal data page in your passport.</p>
                                        <p>Do not redact, watermark or otherwise obscure and part of your ID. This will help ensure we can verify your identity as quickly as possible. </p> 
                                        {uploadButton}
                                        <button onClick={this.GoBack} className='button-2 Goback'><i className="fas fa-long-arrow-alt-left"></i></button>
                                        {this.state.uploadStatus === 2?
                                            <button className='button-1' onClick={this.Submit}>complete verification<i className="fas fa-arrow-right"></i></button>:
                                            <button className='button-disabled'>complete verification<i className="fas fa-arrow-right"></i></button>
                                        }
                                    </div>
                break
            default:
                content = null
        }
        return  <div id='Identity'>
                        <p className='Goback' onClick={this.GoBack}><i className="fas fa-long-arrow-alt-left"></i>Back</p>
                        <p className='Title'>Identity verification</p>
                        {content}
                    </div>
    }
}

export default Identity
