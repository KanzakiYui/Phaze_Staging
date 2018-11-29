import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Loadable from 'react-loadable'
import Load from './Loading'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import {Responsive} from '../responsive'

const Initial = Loadable({ loader: () => import('./Initial'), loading: Load, delay: 1000 })
const Credential = Loadable({ loader: () => import('./Credential'), loading: Load, delay: 1000, render(loaded, props){ let Component = loaded.default; return <Component {...props}/>} })
const EmailVerify = Loadable({ loader: () => import('./EmailVerify'), loading: Load, delay: 1000 })
const Dashboard = Loadable({ loader: () => import('./Dashboard'), loading: Load, delay: 1000 })

class App extends React.Component{
    constructor(props){
        super(props)
        this.state={
            url: window.location.href
        }
    }
    componentDidUpdate(){
        if(this.state.url.toLowerCase() !== window.location.href.toLowerCase())
            this.setState({
                url: window.location.href
            }, Responsive)
    }
    render(){
        return  <Switch>
                        <Route exact path="/" component={Initial}/>
                        <Route exact path="/index.html" component={Initial}/>
                        <Route exact path="/credential" component={Credential}/>
                        <Route exact path="/login" component={Credential}/>
                        <Route exact path="/forgot/:token"  render={(props)=><Credential {...props} formIndex={0}/>} />  
                        <Route exatc path="/forgot" render={(props)=><Credential {...props} formIndex={0}/>} />
                        <Route exact path="/signup/:code"  render={(props)=><Credential {...props} formIndex={2}/>} />  
                        <Route exatc path="/signup" render={(props)=><Credential {...props} formIndex={2}/>} />
                        <Route exact path="/emailverify/:code"  component={EmailVerify} />  
                        <Route path="/dashboard" component={Dashboard}/>
                    </Switch>
    }
}

export default App