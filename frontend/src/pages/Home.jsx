import React from 'react'
import Hero from '../components/Hero'
import About from '../components/About'
import Properties from '../components/Properties'
import featuredImg from '../assets/featured.png'

const Home = () => {
  return (
    <main>
        <Hero/>
        <About/>
        <Properties/>
        <div className='max-padd-container py-16 overflow-x-hidden '>
            <img src={featuredImg} alt='Click to view listings' />
        </div>
        
    </main>
  )
}

export default Home