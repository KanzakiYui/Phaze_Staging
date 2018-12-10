import React from 'react'
import './index.css'
//import {countryToCode, codeToCurrency} from '../../../constants'

class Card extends React.Component{
    constructor(props){
        super(props)
        this.state={
            urlpath: null,
            url: null
        }
    }
    componentDidMount(){
        this.GetURL()
    }
    componentDidUpdate(){
        if(this.props.urlpath!==this.state.urlpath)
            this.GetURL()
    }
    GetURL = ()=>{
        import('../../Media/Images/Cards/'+this.props.urlpath+'.png').then(url=>this.setState({
            urlpath: this.props.urlpath,
            url: url.default
        })).catch(this.GetPlaceHolder)
    }
    GetPlaceHolder = ()=>{
        import('../../Media/Images/Cards/blank.png').then(url=>this.setState({
            urlpath: this.props.urlpath,
            url: url.default
        })).catch(()=>{})
    }
    render(){
        switch(this.props.type){
            case 0:
                return  <img src={this.state.url} alt="" />
            default:
                return null
        }
    }
}

export default Card