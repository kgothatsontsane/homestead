import React from 'react'
import aboutImg from "../assets/about.jpg"
import { MdFormatQuote } from 'react-icons/md'

const About = () => {
  return (
    <section className='max-padd-container py-16 xl:py-28'>
        <div className='flex flex-col xl:flex-row items-center justify-between gap-10'>
            <div className='flex-1 relative'>
                <img src={aboutImg} alt="About Us" className='rounded-full w-[488px]'/>
                  <div className='bg-white absolute bottom-16 left-16 shadow-md max-w-xs max-h-xs p-4 rounded-xl flexCenter flex-col'>
                    <span className='relative bottom-8 p-3 shadow-md bg-white '>
                        <MdFormatQuote className='text-2xl'/>
                    </span>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.strud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <h3>John Doe</h3>
                    <p>CEO</p>       
                </div>
            </div>
        </div>
    </section>
  )
}

export default About