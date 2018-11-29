import React from 'react'
import './index.css'
import LOGO from '../../Utilities/Logo'
function Compatibility(){
    return  <div id='Compatibility'>
                    <LOGO />
                    <p className='GeneralTitle Title'>PHAZE</p>
                    <div className='Content'>
                        <p><i className="fas fa-exclamation-triangle"></i></p>
                        <p>We Do Not Support Current Browser</p>
                        <p>We Recommend Latest Versions of</p>
                        <div className="List">
                            <p><i className="fab fa-chrome"> Chrome (recommend)</i><a href="https://www.google.com/chrome/">View</a></p>
                            <p><i className="fab fa-firefox"> Firefox (recommend)</i><a href="https://www.mozilla.org">View</a></p>
                            <p><i className="fab fa-safari"> Safari</i><a href="https://www.apple.com/ca/safari/">View</a></p>
                            <p><i className="fab fa-opera"> Opera</i><a href="https://www.opera.com/">View</a></p>   
                        </div>
                    </div>
               </div>
}

export default Compatibility