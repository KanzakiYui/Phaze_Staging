import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

class Messagebox extends React.Component{
    render(){
        let element = null
        if(this.props.open){
            if(this.props.type!=='search')
                document.activeElement.blur()
            let boxClass = 'MessageScreen '+this.props.type
            element =   <div className={boxClass} onTouchMove={(event)=>event.stopPropagation()} onMouseMove={(event)=>event.stopPropagation()}>
                                    <div className='Content'>
                                        {this.props.content}
                                    </div>
                                    <button className='button-2' onClick={this.props.close}>{this.props.buttonText}</button>
                                </div>
        }
        return ReactDOM.createPortal(element, document.body)
    }
}

export default Messagebox
