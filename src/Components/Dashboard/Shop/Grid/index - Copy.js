import React from 'react'
import './index.css'
import Card from '../../Card'
import Slider from "react-slick"
import Messagebox from '../../../../Utilities/Message'


class Grid extends React.Component{
    constructor(props){
        super(props)
        this.featured = ['amazonca', 'amazonus', 'starbucksca', 'starbucksus', 'keg', 'walmart', 'bestbuy', 
                                'aircanada', 'americanairlines', 'cineplex', 'milestones', 'montanas', 'sephora']            
        this.state={
            pageIndex: 0,
            prev: false,
            next: this.props.brandInfo.length > this.props.itemsPerPage ? true: false,  // each row has at most 4 items, desktop 8 items (2 rows) and mobile 12 items (3 rows)
            openJumpBox: false,
        }
    }
    Prev = ()=>{
        this.setState(prevState=>({
            pageIndex: prevState.pageIndex - 1,
            prev: prevState.pageIndex === 1? false : true,
            next: true
        }))
    }
    Next = ()=>{
        let max = Math.ceil(this.props.brandInfo.length/this.props.itemsPerPage) - 1
        this.setState(prevState=>({
            pageIndex: prevState.pageIndex + 1,
            prev: true,
            next: prevState.pageIndex === max - 1? false : true,
        }))
    }
    JumpTo = ()=>{
        let inputValue = Math.round(Number(document.getElementById('Shop-Jump-Content').querySelector('input').value))
        inputValue = Math.max(inputValue, 1)
        let max = Math.ceil(this.props.brandInfo.length/this.props.itemsPerPage)
        inputValue = Math.min(inputValue, max )
        this.setState({
            pageIndex: inputValue - 1,
            openJumpBox: false,
            prev: inputValue === 1 ? false : true,
            next: inputValue === max ? false : true,
        })
    }

    ClickedCard = (event) => {
        let card = event.target.closest('div.Card')
        if(!card)
            return
        this.props.select(card.dataset.value)
    }
    render(){
        let featuredCards = this.props.brandInfo.filter(item=>this.featured.includes(item.code)).map((item, index)=><Card key={index} type={0} name={item.name} country={item.country} urlpath={item.code} />)
        let settings = {
            centerMode: true,
            centerPadding: "10%",
            dots: false,
            arrows: false,
            speed: 500,
            slidesToShow: 3,
            swipeToSlide: true,
        }
        let prevButton = this.state.prev?<p className="Active" onClick={this.Prev}><i className="fas fa-angle-double-left"></i></p>
                                  : <p><i className="fas fa-angle-double-left"></i></p>
        let nextButton = this.state.next?<p className="Active" onClick={this.Next}><i className="fas fa-angle-double-right"></i></p>
                                  : <p><i className="fas fa-angle-double-right"></i></p>
        let normalCards = this.props.brandInfo.slice(this.state.pageIndex*this.props.itemsPerPage, this.state.pageIndex*this.props.itemsPerPage+this.props.itemsPerPage)
                                     .map((item, index)=><Card key={index} type={1} name={item.name} country={item.country} urlpath={item.code} />)
        let jumpContent = <div id='Shop-Jump-Content'>
                                        <p>I wanna jump to...</p>
                                        <input type='number' min='1' autoFocus></input>
                                        <button className='button-1' onClick={this.JumpTo}>Confirm</button>
                                     </div>
        return  <div id='Shop-Grid'>
                        <div id='Shop-Grid-Featured'>
                            <p className='Title'>Signatured</p>
                            <div className='Content' onClick={(event)=>this.ClickedCard(event)}>
                                <Slider {...settings}>
                                    {featuredCards}
                                </Slider>
                            </div>
                        </div>
                        <div id='Shop-Grid-Brands'>
                            <p className='Title'>All Brands</p>
                            <div className='Content' onClick={(event)=>this.ClickedCard(event)}>
                                {normalCards}
                            </div>
                            <div className='Pagination'>
                                {prevButton}
                                <span onClick={()=>this.setState({openJumpBox: true})}>{this.state.pageIndex + 1}</span>
                                {nextButton}
                            </div>
                        </div>
                        <Messagebox open={this.state.openJumpBox} type='info' content={jumpContent} buttonText='Cancel' close={()=>this.setState({openJumpBox: false})} />
                    </div>
    }
}

export default Grid