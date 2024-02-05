import React from 'react'
import './home.css'
import HomeFeed from '../../components/feed/home-feed'



const HomePage = () => {

 
  return (
    <div className='home-page'>
      <div className="home-page-wrapper">
          <div className='home-page-content-top'>
            <h2 className='welcome-message'> Welcome to Big At Heart  </h2>
            <p className='volunteer-quote'> Vonlunteering makes a difference</p>

          </div>
     
            <HomeFeed />   
     
             
      </div>
         
    </div>
  )
}

export default HomePage
