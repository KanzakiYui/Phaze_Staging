import React from 'react'
import './index.css'
import LOGO from '../../Media/Images/Logo.png'
import {POSTAPI} from '../../https'
import Card from '../../Utilities/Card'

class Login extends React.Component{
    constructor(props){
        super(props)
        this.state={
            authMessage: null
        }
    }
    componentDidMount(){
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth'})
    }
    LoginAccount = (event)=>{
        event.preventDefault()
        let emailEl = event.target['login-email']
        let passEl = event.target['login-password']
        if(!emailEl.validity.valid || !passEl.validity.valid){
            emailEl.classList.add('Checked')
            passEl.classList.add('Checked')
            this.setState({ authMessage: null })
        }
        else{
            let body = {
                username: emailEl.value,
                password: passEl.value
            }
            POSTAPI('public/login', body).then(response=>{
                this.setState({
                    authMessage: null
                },()=>this.props.history.push('/dashboard'))
            }).catch(error=>this.setState({authMessage: error.statusCode === 401?'Wrong credentiail':'Please try again'}))
        }
    }
    render(){
        let Row1 = ['amazonca', 'aircanada', 'starbucksca', 'walmart'].map((url, index)=><Card type={0} key={index} urlpath={url} />)
        let Row2 = ['keg', 'sephora', 'cineplex', 'milestones'].map((url, index)=><Card type={0} key={index} urlpath={url} />)
        return  <div id='Login'>
                        <div id='Login-Desktop-Background'>
                            <div className='Left'>
                                <p className='Title'>Spend your crypto anywhere!</p>
                                <p className='Description'>The worlds biggest merchants exclusively accept cryptocurrency through Phaze wallet and reward you with bonuses at all of their online and in-store locations.</p>
                                <div className='Row'>
                                    {Row1}
                                </div>
                                <div className='Row'>
                                    {Row2}
                                </div>
                            </div>
                            <div className='Right'>
                            </div>
                        </div>
                        <div id='Login-Main'>
                            <img src={LOGO} alt="" />
                            <p className='Title'>Free your <br/>cryptocurrency</p>
                            <p className='Description'>Spend your crypto internationally at over 100,000 locations - online and in-store.</p>
                            <form noValidate onSubmit={(event)=>this.LoginAccount(event)}>
                                <div className='Inline-Input'>
                                    <input id='login-email' name='login-email' type='email' maxLength='24' placeholder='e-mail' required spellCheck="false"></input>
                                    <label htmlFor='login-email'>
                                        <i className="far fa-envelope"></i>
                                    </label>
                                    <p>Email should be valid</p>
                                </div>
                                <div className='Inline-Input'>
                                    <input id='login-password' name='login-password' type='password' maxLength='24' pattern='^[0-9A-z]+$' placeholder='password' required></input>
                                    <label htmlFor='login-password'>
                                        <i className="fas fa-key"></i>
                                    </label>
                                    <p>Password is required</p>
                                </div>
                                {this.state.authMessage?
                                    <p className='AuthError'>{this.state.authMessage}</p>
                                :null
                                }
                                <button type='submit' className='button-1'>login<i className="fas fa-arrow-right"></i></button>
                                <button type='button' className='button-2' onClick={()=>this.props.history.push('/signup')}>sign up<i className="fas fa-arrow-right"></i></button>
                            </form>
                            <p className='Forgot' onClick={()=>this.props.history.push('/forgot')}>Forgot your password?</p>
                        </div>
                    </div>
    }
}

export default Login