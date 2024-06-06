import React from 'react'
import '../css/footer.css'
import Clock from './Clock'

const Footer = () => {
  return (
    <div className="footer_cover">
        <div>Pawscribe - Seamlessly Share, Collaborate, and Manage Your Documents.</div>
        <div className='footer'>
        <div className="copywright">
        
       <div><span>&#169; 2024</span><span>All rights reserved</span></div>
        </div>
        <div className="concepts">
            pawscribe
        </div>
        <div className="clock">
        <Clock/>
        </div>
    </div>
    </div>
  )
}

export default Footer
