import React from 'react'
import './index.css'

class Dropdown extends React.Component{
    constructor(props){
        super(props)
        this.state={
            open: false,
            selectedIndex: 0
        }
    }
    SelectItem = (event) =>{
        let item = event.target.closest('div.Dropdown-Item')
        if(!item)
            return
        this.setState({
            selectedIndex: Number(item.dataset.value),
            open: false,
        },()=>{
            let option = this.props.data[this.state.selectedIndex].props['data-value']
            this.props.filter(option)
        })
    }
    render(){
        let items = this.props.data.map((item, index)=><div key={index} className='Dropdown-Item' data-value={index}>{item}</div>)
        let dropdownClass = this.state.open?"Active":""
        return  <div className='Dropdown'>
                        <p className='Title'>{this.props.title}</p>
                        <div className='Select' onClick={()=>this.setState(prevState=>({open:!prevState.open}))}>
                            {items[this.state.selectedIndex]}
                            <i className="fas fa-angle-double-down"></i>
                        </div>
                        <div className={'Dropdown-Content '+dropdownClass} onClick={(event)=>this.SelectItem(event)}>
                            {items}
                        </div>
                    </div>
    }
}

export default Dropdown