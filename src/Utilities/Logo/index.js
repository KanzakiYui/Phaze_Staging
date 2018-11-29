import React from'react'
import './index.css'
import Logo_Left from '../../Media/Images/Logo_Left.png'
import Logo_Right from '../../Media/Images/Logo_Right.png'

function LOGO(){
    return  <div id='LOGO'>
                    <img src={Logo_Left} alt="" />
                    <img src={Logo_Right} alt="" />
                </div>
}

export default LOGO