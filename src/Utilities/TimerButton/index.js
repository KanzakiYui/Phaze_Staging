import React from 'react'

class TimerButton extends React.Component{
    constructor(props){
        super(props)
        this.state={
            disable: false,
            time: -1
        }
        this.timer = null
    }
    componentWillUnmount(){
        clearInterval(this.timer)
    }
    Click = ()=>{
        this.props.onClick()
        this.setState({
            disable: true,
            time: this.props.time
        }, ()=>this.timer = setInterval(this.Tick, 1000))
    }
    Tick = () =>{
        if(this.state.time !== 1)
            this.setState(prevState=>({time: prevState.time - 1}))
        else{
            this.setState({
                time: -1,
                disable: false
            })
            clearInterval(this.timer)
        }
    }
    render(){
        if(this.state.disable)
            return <button className='disabled' disabled>{this.props.disabledText} in {this.state.time} sec</button>
        else
            return <button className={this.props.className} onClick={this.Click}>{this.props.text}</button>
    }
}

export default TimerButton