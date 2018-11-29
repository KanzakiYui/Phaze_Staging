import React from 'react'
import './index.css'
import Loader from 'react-loader-spinner'
function Loading(props) {
    if(props.pastDelay)
      return    <div className="LoadingScreen">
                      <span>Loading</span><Loader type="Grid" color="var(--color-gold-dark)" height="25" width="25"/>
                    </div>
      return null
  }

  export default Loading