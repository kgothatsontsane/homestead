import React from 'react'
import Hero from '../components/Hero'
import About from '../components/About'
import Properties from '../components/Properties'

const Home = () => {
  return (
    <main>
        <Hero/>
        <About/>
        <Properties/>
        <div>
            <img src={bannerImg} alt='' />
        </div>
    </main>
  )
}

export default Home