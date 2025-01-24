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
        <div>
            <img src={featuredImg} alt='' />
        </div>
    </main>
  )
}

export default Home