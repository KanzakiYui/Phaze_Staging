import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Loadable from 'react-loadable'
import Load from './Loading'

const Login = Loadable({ loader: () => import('./Login'), loading: Load, delay: 1000 })
const Signup = Loadable({ loader: () => import('./Signup'), loading: Load, delay: 1000 })

class App extends React.Component{
    render(){
        return  <Switch>
                        <Route exact path="/" component={Login}/>
                        <Route exact path="/index.html" component={Login}/>
                        <Route exact path="/login" component={Login}/>
                        <Route exact path="/signup/:code" component={Signup}/>
                        <Route exact path="/signup" component={Signup}/>
                    </Switch>
    }
}

export default App