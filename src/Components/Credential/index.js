import React from 'react'
import './index.css'
import Slider from "react-slick"
import Login from './Login'
import Forgot from './Forgot'
import Signup from './Signup'

class Credential extends React.Component{
    constructor(props){
        super(props)
        this.state={
            formIndex: this.props.formIndex!==undefined?this.props.formIndex:1                                           
            //  0 means left (forgot), 1 means middle (login), 2 means right (signup)
        }
    }
    FormIndexChanged = (index)=>{
        this.setState({
            formIndex: index
        })
    }
    Swipe = ()=>{                                                                                   // When swipe, blur actived element (especially for mobile keyboard)
        let element = document.activeElement
        let nodeName = element.nodeName.toLowerCase()
        let condition1 = element.nodeType === 1
        let condition2 = nodeName === "textarea"
        let condition3 = nodeName === "input" && /^(?:text|email|number|search|tel|url|password)$/i.test(element.type)
        if(condition1 && (condition2 || condition3))
            element.blur()
    }
    render(){
        let settings = {
            centerMode: true,
            centerPadding: "10%",
            initialSlide: this.state.formIndex,
            dots: false,
            arrows: false,
            infinite: false,
            speed: 500,
            slidesToShow: 1,
            afterChange: this.FormIndexChanged,
            onSwipe: this.Swipe
        }
        return  <div id='Credential'>
                        <Slider {...settings}>
                            <div className='FormSnippet Form-1'>
                                <Forgot token={this.props.match.params.token}/>
                                <span className='Arrow'></span>
                            </div>
                            <div className='FormSnippet Form-2'>
                                <Login login={()=>this.props.history.push('/dashboard')}/>
                                <span className='Arrow'></span>
                            </div>
                            <div className='FormSnippet Form-3'>
                                <Signup code={this.props.match.params.code}/>
                                <span className='Arrow'></span>
                            </div>
                        </Slider>
                        <button type='submit' form={'form-'+this.state.formIndex} className='button-1 Confirm'>Confirm</button>
                    </div>
    }
}

export default Credential