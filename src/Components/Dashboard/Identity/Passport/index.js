import React from 'react'
import './index.css'
import {countryToCode} from '../../../../constants'
import {POSTAPI} from '../../../../https'
import Messagebox from '../../../../Utilities/Message'
import CustomLoader from '../../../../Utilities/CustomLoader'

class Passport extends React.Component{
    constructor(props){
        super(props)
        this.state={
            file: null,
            data: null,
            openError: false,
            errorMessage: null,
            processing: false,
        }
    }
    ImageChanged = (event)=>{
        let file = event.target.files[0]
        if(!file || file.type.indexOf('image') === -1)
            file = null
        this.setState({
            file: file
        }, this.Preview)
    }
    Preview = ()=>{
        if(!this.state.file){
            this.setState({data: null})
            return
        }   
        let reader = new FileReader()
        reader.addEventListener('load', ()=>this.setState({data: reader.result}))
        reader.readAsDataURL(this.state.file)
    }
    Upload = ()=>{
        if(!this.state.file)
            return
        this.setState({
            processing: true
        })
        let imageBase64 = this.state.data.slice(this.state.data.indexOf("base64,")+7)
        let body = {
            country_code: countryToCode[this.props.country],
            id_type: 'PassportBook',
            front_image: imageBase64 
        }
        POSTAPI('users/kyc_check', body).then(response=>{
            this.props.GoNext()
        }).catch(error=>{
            if(error.statusCode === 401)
                    this.props.Cancel()
                else
                    this.setState({
                        processing: false,
                        openError: true,
                        errorMessage: error.statusCode === 400? 'You Are Already Verified' : 'Internal Errors Happen'
                    })
        })
    }
    render(){
        let Content =   <React.Fragment>
                                    <div className='Browse'>
                                        <div>
                                            <img src={this.state.data} alt="" />
                                        </div>
                                        <label>
                                            {this.state.data?null:<span>{'Click or Tap to \n Upload or Change'}</span>}
                                            <input type='file' style={{display: 'none'}} accept="image/*" onChange={(event)=>this.ImageChanged(event)}></input>
                                        </label>
                                    </div>
                                    <button className='button-1' onClick={this.Upload}>Confirm</button>
                                    <button className='button-2' onClick={this.props.GoBack}>Go Back</button>
                                </React.Fragment>
        if(this.state.processing)
            Content = <CustomLoader type='Oval' message='Processing' color='var(--color-red-dark)'/>
        return  <div id='Identity-Content' className='Identity-Passport'>
                        <p className='Title'>3. Passport in {this.props.country}</p>
                        <p className='Description'>Please upload image copy of the photo page in your valid passport  issued by {this.props.country}</p>
                        <p className='Note'>Please do not redact, watermark or otherwise obscure any part of your ID. This will help ensure we can verify your identity document as quickly and accurately as possible.</p>
                        {Content}
                        <Messagebox open={this.state.openError} type='error' buttonText='Close' content={this.state.errorMessage} close={()=>this.setState({openError: false})} />
                    </div>
    }
}

export default Passport