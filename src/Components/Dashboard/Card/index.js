import React from 'react'
import './index.css'
import {countryToCode, codeToCurrency} from '../../../constants'

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
        import('../../../Media/Images/Cards/'+this.props.urlpath+'.png').then(url=>this.setState({
            urlpath: this.props.urlpath,
            url: url.default
        })).catch(this.GetPlaceHolder)
    }
    GetPlaceHolder = ()=>{
        import('../../../Media/Images/Cards/blank.png').then(url=>this.setState({
            urlpath: this.props.urlpath,
            url: url.default
        })).catch(()=>{})
    }
    render(){
        switch(this.props.type){
            case 0:
                return  <div className='Card Card-Featured' data-value={this.props.urlpath}>
                                <img src={this.state.url} alt="" />
                                <div>
                                    <p className='CardName'>{this.props.name}</p>
                                    <p className='CardCountry'>{this.props.country}</p>
                                </div>
                            </div>
            case 1:
                return  <div className='Card Card-Normal' data-value={this.props.urlpath}>
                                <img src={this.state.url} alt="" />
                                <div>
                                    <p className='CardName'>{this.props.name}</p>
                                    <p className='CardCountry'>{this.props.country}</p>
                                </div>
                            </div>
            case 2:
                return  <div className='Card Card-Denomination'>
                                <img src={this.state.url} alt="" />
                                <p className='CardValue'>$ {this.props.value} {codeToCurrency[countryToCode[this.props.country]]}</p>
                            </div>
            case 3:
                return  <div className='Card Card-Arbitrary'>
                                <img src={this.state.url} alt="" />
                                <p className='CardValue'>$ {this.props.min} ~ $ {this.props.max} {codeToCurrency[countryToCode[this.props.country]]}</p>
                            </div>
            case 4:
                return  <div className='Card Card-Search'>
                                <img src={this.state.url} alt="" />
                                <div>
                                    <p className='CardName'>{this.props.name}</p>
                                    <p className='CardCountry'>{this.props.country}</p>
                                </div>
                            </div>
            case 5:
                return  <img src={this.state.url} alt="" />
            default:
                return null
        }
    }
}

export default Card