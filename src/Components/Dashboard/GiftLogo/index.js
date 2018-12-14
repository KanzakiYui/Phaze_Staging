import React from 'react'
import './index.css'


class GiftLogo extends React.Component{
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
        import('../../../Media/Images/Logos/'+this.props.urlpath+'.png').then(url=>this.setState({
            urlpath: this.props.urlpath,
            url: url.default
        })).catch(this.GetPlaceHolder)
    }
    GetPlaceHolder = ()=>{
        import('../../../Media/Images/Logos/blank.png').then(url=>this.setState({
            urlpath: this.props.urlpath,
            url: url.default
        })).catch(()=>{})
    }
    render(){
        return  <div className='GiftLogo-Simple'>
                        <img src={this.state.url} alt="" />
                    </div>
    }
}

export default GiftLogo
