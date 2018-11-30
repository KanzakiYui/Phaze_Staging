import React from 'react'
import './index.css'
import Card from '../../Card'
import Slider from "react-slick"
import Messagebox from '../../../../Utilities/Message'
import Scrollbar from 'smooth-scrollbar'

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
        this.touchStartPos = 0
        this.touchPos = 0
    }
    componentDidMount(){
        if(Scrollbar.has(document.body))
            Scrollbar.get(document.body).scrollTo(0, 0, 500)
        else
            window.scrollTo(0, 0)
    }
    componentDidUpdate(){                                   // edge case handler
        let max = Math.ceil(this.props.brandInfo.length/this.props.itemsPerPage) - 1
        if(this.state.pageIndex > max)
            this.setState({
                pageIndex: max,
                next: false
            })
        else if(this.state.pageIndex === max && this.state.next)
            this.setState({
                next: false
            })
        else if(this.state.pageIndex < max && !this.state.next)
            this.setState({
                next:  true
            })
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
            next: prevState.pageIndex === max - 1? false : true
        }))
    }
    TouchStart = (event)=>{
        this.touchStartPos = event.touches[0].clientX
        this.touchPos = event.touches[0].clientX
    }
    TouchMove = (event)=>{
        this.touchPos = event.touches[0].clientX
    }
    TouchEnd = ()=>{
        if(this.touchPos - this.touchStartPos < -100 && this.state.pageIndex < Math.ceil(this.props.brandInfo.length/this.props.itemsPerPage) - 1 )
            this.Next()
        else if(this.touchPos - this.touchStartPos > 100 && this.state.pageIndex > 0)
            this.Prev()
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
            centerPadding: this.props.itemsPerPage < 5 ? "25%" : "10%",
            dots: false,
            arrows: false,
            speed: 500,
            slidesToShow: this.props.itemsPerPage < 5 ? 1 : 3,
            swipeToSlide: true,
        }
        let prevButton = this.state.prev?<i className="Pagination Left fas fa-arrow-circle-left" onClick={this.Prev}></i>:null
        let nextButton = this.state.next?<i className="Pagination Right fas fa-arrow-circle-right" onClick={this.Next}></i>:null
        let normalCards = this.props.brandInfo.slice(this.state.pageIndex*this.props.itemsPerPage, this.state.pageIndex*this.props.itemsPerPage+this.props.itemsPerPage)
                                     .map((item, index)=><Card key={index} type={1} name={item.name} country={item.country} urlpath={item.code} />)
        let jumpContent = <div id='Shop-Jump-Content'>
                                        Go To Page<input type='number' min='1' autoFocus placeholder="Page Number"></input><br />
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
                        <div id='Shop-Grid-Brands' onTouchStart={(event)=>this.TouchStart(event)} onTouchMove={(event)=>this.TouchMove(event)} onTouchEnd={this.TouchEnd}>
                            <p className='Title'>All Brands <span>({this.props.brandInfo.length})</span></p>
                            <div className='Content' onClick={(event)=>this.ClickedCard(event)}>
                                <div>
                                    {normalCards.slice(0, normalCards.length/2)}
                                </div>
                                <div>
                                    {normalCards.slice(normalCards.length/2)}
                                </div>
                            </div>
                            <p className='Notice'>Swipe or Click Navigator to View More</p>
                            {prevButton}
                            {nextButton}
                            <p id='Grid-Jump' onClick={()=>this.setState({openJumpBox: true})}>
                                {this.state.pageIndex+1}
                            </p>
                        </div>
                        <Messagebox open={this.state.openJumpBox} type='input' content={jumpContent} buttonText='Cancel' close={()=>this.setState({openJumpBox: false})} />
                    </div>
    }
}

export default Grid