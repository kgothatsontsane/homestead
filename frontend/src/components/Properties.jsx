import React from 'react'
import { Link } from 'react-router-dom'
import { VscSettings } from 'react-icons/vsc'
import { Swiper } from 'swiper/react'

const Properties = () => {
  return (
    <section className='max-padd-container'>
        <div className='max-padd-container bg-primary py-16 xl:py-28 rounded-3xl'>
            <span className='medium-18'>
                Your Dream Home Awaits
            </span>
            <h2 className='h2 capitalize'>
                Discover Your Future Home
            </h2>
            <div className='flexBetween mt-8 mb-6'>
                <h5><span className='font-bold'>Showing 1-10</span> of 4k homes</h5>
                <Link to={'/'} className='bg-white text-3xl rounded-md h-10 w-10 p-1 border'><VscSettings/></Link>
                <Swiper>
                    
                </Swiper>
            </div>
        </div>
    </section>
  )
}

export default Properties