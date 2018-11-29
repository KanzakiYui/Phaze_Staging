import React from 'react'
import './index.css'
import Scrollbar from 'smooth-scrollbar'
import CanadaImage from '../../../Media/Images/Identity/canada.png'
import USAImage from '../../../Media/Images/Identity/usa.png'
import Phone from './Phone'
import Passport from './Passport'

class Identity extends React.Component{
    constructor(props){
        super(props)
        this.state={
            status: 0,                                   // 0 legal, 1 country, 2 phone, 3 upload, 4 success
            country: 'Canada'                      // By default we set to Canada
        }
    }
    componentDidMount(){
        if(Scrollbar.has(document.body))
            Scrollbar.get(document.body).scrollTo(0, 0, 500)
        else
            window.scrollTo(0, 0)
    }
    Cancel = () => {
        this.props.history.push('/dashboard')
    }
    GoNext = ()=>{
        this.setState(prevState=>({status: prevState.status + 1}))
    }
    GoBack = ()=>{
        this.setState(prevState=>({status: prevState.status - 1}))
    }
    SelectCountry = (value)=>{
        this.setState({
            country: value,
            status: 2
        })
    }
    render(){
        let content = [
            <LegalNotice Cancel={this.Cancel} GoNext={this.GoNext}/>,
            <CountrySelection GoBack={this.GoBack} SelectCountry={this.SelectCountry} />,
            <Phone Cancel={this.Cancel} GoBack={this.GoBack} country={this.state.country} GoNext={this.GoNext} />,
            <Passport Cancel={this.Cancel} GoBack={this.GoBack} country={this.state.country} GoNext={this.GoNext} />,
            <Success Cancel={this.Cancel}/>
        ]
        return  <div id='Identity'>
                        <p className='Title'>Identity Verification</p>
                        {content[this.state.status]}
                    </div>
    }
}

export default Identity

function LegalNotice(props){
    return  <div id='Identity-Content' className='Identity-Legal'>
                    <p className='Title'>Legal Notice</p>
                    <p className='Description'>We will never store a digital copy of your credential information. We send a data in encrypted version to trusted third party in order to verify your identity. This process is used to identify your credit and to active all of Phaze App features.</p>
                    <p className='Note'>Please be honest and responsible to all information you submit during process. You may need start from beginning if you cancel the process half way.</p>
                    <button className='button-1' onClick={props.GoNext}>Continue</button>
                    <button className='button-2' onClick={props.Cancel}>Cancel</button>
                </div>
}

function CountrySelection(props){
    return  <div id='Identity-Content' className='Identity-Country'>
                    <p className='Title'>1. Select Your Citizenship</p>
                    <p className='Description'>Please choose your legal citizenship below. Currently, we only accept citizens of either United States or Canada.</p>
                    <p className='Note'>Please ensure all information you submit during the process are issued, used and valid in the same country you selected here.</p>
                    <div className='Select'>
                        <div onClick={()=>props.SelectCountry('Canada')}>
                            <img src={CanadaImage} alt="" />
                            <p>Canada</p>
                        </div>
                        <div onClick={()=>props.SelectCountry('United States')}>
                            <img src={USAImage} alt="" />
                            <p>United States</p>
                        </div>
                    </div>
                    <button className='button-2' onClick={props.GoBack}>Go Back</button>
                </div>
}

function Success(props){
    return  <div id='Identity-Success'>
                    <p className='Title'>Thanks for Submission</p>
                    <p className='Description'>We will process your information as soon as possible. Once there is a result available, you will be notified via SMS message on your phone.</p>
                    <p className='Note'>If you cannot pass this process for several times, please contact us at <span>team@phaze.io</span></p>
                    <button className='button-1' onClick={props.Cancel}>OK</button>
                </div> 
}