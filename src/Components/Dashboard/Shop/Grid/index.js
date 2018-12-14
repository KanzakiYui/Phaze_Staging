import React from 'react'
import './index.css'
import placeholder from './placeholder.png'
import GiftCard from '../../GiftCard'
import GiftLogo from '../../GiftLogo'

class Grid extends React.Component{
    constructor(props){
        super(props)
        this.featured = ['amazonca', 'amazonus', 'starbucksca', 'starbucksus', 'keg', 'walmart', 'bestbuy', 
                                'aircanada', 'americanairlines', 'cineplex', 'milestones', 'montanas', 'sephora']
        this.state={
            country: 'Canada',                                // by default
            category: 'all',    
            currentBrandInfo: this.props.brandInfo.filter(item=>item.country==='Canada')                // by default
        }
    }
    ChangeCountry = ()=>{

    }
    ChangeCategory = (event)=>{
        let element = event.target.closest('span')
        if(!element)
            return
        this.setState({
            category: element.dataset.value
        })
    }
    ChangeKeyword = ()=>{

    }
    CategoryResult = ()=>{
        let array = this.props.brandInfo.filter(item=>item.country===this.state.country)
        //if(category!=='all')
        return array
    }
    SearhResult = ()=>{

    }
    render(){
        let featuredCards = this.featured.map((card, index)=><GiftCard key={index} urlpath={card}/>)
        let allLogos = this.CategoryResult().map((info, index)=><GiftLogo key={index} urlpath={info.code}/>)
        return  <div id='Shop-Grid'>
                        <div id='Grid-Desktop-Background'>
                            <img src={placeholder} alt="" />
                        </div>
                        <div id='Grid-Main'>
                            <div id='Grid-Featured'>
                                <p className='Title'>Featured</p>
                                <div className='Content'>
                                    {featuredCards}
                                </div>
                            </div>
                            <div id='Grid-Category' onClick={(event)=>this.ChangeCategory(event)}>
                                <span data-value="all" className={this.state.category==='all'?"Active":""}>All cards</span>
                                <span data-value="fashion" className={this.state.category==='fashion'?"Active":""}>Fashion</span>
                                <span data-value="restaurant" className={this.state.category==='restaurant'?"Active":""}>Restaurant</span>
                                <span data-value="travel" className={this.state.category==='travel'?"Active":""}>Travel</span>
                                <span data-value="retail" className={this.state.category==='retail'?"Active":""}>Retail</span>
                                <span data-value="others" className={this.state.category==='others'?"Active":""}>Others</span>
                            </div>
                            <div id='Grid-AllBrands'>
                                {allLogos}
                            </div>
                        </div>
                        {this.props.openSearch?
                            <div id='Shop-Search-Overlay'>
                                <i className="fas fa-times" onClick={this.props.CloseSearch}></i>
                                <form noValidate>
                                    <div className='Inline-Input'>
                                        <input id='shop-search' type='text' maxLength='30' placeholder='type a keyword' spellCheck="false" autoComplete="false"></input>
                                        <label htmlFor='shop-search'>
                                            <i className="fas fa-search"></i>
                                        </label>
                                        <p>There is no matched result</p>
                                    </div>
                                </form>
                            </div>
                            :null
                        }
                    </div>
    }
}

export default Grid

