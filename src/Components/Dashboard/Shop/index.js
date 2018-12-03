import React from 'react'
import './index.css'
import {NavLink, Switch, Route} from 'react-router-dom'
import Loadable from 'react-loadable'
import LoadingIndicator from '../../Loading'
import MessageBox from '../../../Utilities/Message'
import Dropdown from '../../../Utilities/Dropdown'
// The following are search icons 
import CanadaIcon from '../../../Media/Images/Search/Canada.png'
import USAIcon from '../../../Media/Images/Search/USA.png'
import RestaurantIcon from '../../../Media/Images/Search/restaurant.png'
import TravelIcon from '../../../Media/Images/Search/travel.png'
import RetailIcon from '../../../Media/Images/Search/retail.png'
import FashionIcon from '../../../Media/Images/Search/fashion.png'
import OthersIcon from '../../../Media/Images/Search/others.png'
import Card from '../Card'

const Grid = Loadable({ loader: () => import('./Grid'), loading: LoadingIndicator, delay: 1000, render(loaded, props){ let Component = loaded.default; return <Component {...props}/>} })
const Map = Loadable({ loader: () => import('./Map'), loading: LoadingIndicator, delay: 1000, render(loaded, props){ let Component = loaded.default; return <Component {...props}/>} })

class Shop extends React.Component{
    constructor(props){
        super(props)
        this.state={
            openSearchBox: false,
            CountrySelected: ['Canada', 'United States'],
            CategorySelected: ['Restaurant', 'Travel', 'Mall', 'Others'],
            keywords: ""
        }
    }
    ChangeCountryFilter = (info)=>{
        if(info === 'All')
            this.setState({CountrySelected: ['Canada', 'United States']})
        else
            this.setState({CountrySelected: [info]})
    }
    ChangeCategoryFilter = (info)=>{
        if(info === 'All')
            this.setState({CategorySelected: ['Restaurant', 'Travel', 'Mall', 'Others']})
        else
            this.setState({CategorySelected: [info]})
    }
    ChangeKeywords = (event)=>{
        this.setState({
            keywords: event.target.value
        })
    }
    render(){
        let countryData = [ <p data-value='All'>All</p>, <p data-value='Canada'><img src={CanadaIcon} alt=""/>Canada</p>, <p data-value='United States'><img src={USAIcon} alt=""/>United States</p> ]
        let categoryData = [ <p data-value='All'>All</p>, 
                                        <p data-value='Fashion'><img src={FashionIcon} alt=""/>Fashion</p>, 
                                        <p data-value='Restaurant'><img src={RestaurantIcon} alt=""/>Restaurant</p>, 
                                        <p data-value='Travel'><img src={TravelIcon} alt=""/>Travel</p>, 
                                        <p data-value='Retail'><img src={RetailIcon} alt=""/>Retail</p>, 
                                        <p data-value='Others'><img src={OthersIcon} alt=""/>Others</p>
                                    ]
        let brands = this.props.brandInfo.filter(item=>this.state.CountrySelected.includes(item.country))
        //brands = brands.filter(item=>this.state.CategorySelected.includes(item.category))
        brands = brands.filter(item=>item.code.indexOf(this.state.keywords)!==-1||item.name.indexOf(this.state.keywords)!==-1)
        brands = brands.slice(0, 3).map((item, index)=><Card key={index} type={4} name={item.name} country={item.country} urlpath={item.code}/>)
        
        let searchBox =   <div id='Shop-Seachbox'>
                                        <input type='text' maxLength='20' placeholder='Type Your Keywords' value={this.state.keywords} onChange={(event)=>this.ChangeKeywords(event)}></input>
                                        <div className='Filter'>
                                            <Dropdown data={countryData} title={'Choose Country'} filter={this.ChangeCountryFilter}/>
                                            <Dropdown data={categoryData} title={'Choose Category'} filter={this.ChangeCategoryFilter}/>
                                        </div>
                                        <div className='Content'>
                                            {brands}
                                        </div>
                                    </div>
        
        
        return  <div id='Shop'>
                        <div id='Shop-Nav'>
                            <div>
                                <NavLink exact to="/dashboard" activeClassName="Active">
                                <span>GRID</span>
                                    <i className="fas fa-th-large"></i>
                                </NavLink>
                                <NavLink exact to="/dashboard/map" activeClassName="Active">
                                    <span>MAP</span>
                                    <i className="fas fa-map-marked-alt"></i>    
                                </NavLink>
                            </div>
                            <div onClick={()=>this.setState({openSearchBox: true})}>
                                <span>SEARCH</span>
                                <i className="fas fa-search"></i>
                            </div>
                        </div>
                        <div id='Shop-Content'>
                            <Switch>
                                <Route exact path="/dashboard" render={(props)=> <Grid {...props} brandInfo={this.props.brandInfo} select={this.props.select} itemsPerPage={this.props.itemsPerPage}/>}/>
                                <Route exact path="/dashboard/map" render={(props)=> <Map {...props} brandInfo={this.props.brandInfo} select={this.props.select} />}/>
                            </Switch>
                        </div>
                        <MessageBox open={this.state.openSearchBox} type='search' content={searchBox} buttonText='Cancel' close={()=>this.setState({openSearchBox: false})} />
                    </div>
    }
}

export default Shop