import React from 'react'
import './index.css'
import LOGO from '../../../Media/Images/Logo.png'

class Notverified extends React.Component{
    constructor(props){
        super(props)
        this.state={
            step: 0                                             // 0 means before 1st send, 1 means before 2nd send, 2(3, 4, 5, ...) means before 3rd/4th/5th... send
        }
    }
    render(){
        let main = null
        return  <div id='Notverified'>
                        <img src={LOGO} alt="" />
                        {main}
                        <button className='button-2' onClick={this.props.Logout}>log out<i className="fas fa-arrow-right"></i></button>
                    </div>
    }
}

export default Notverified