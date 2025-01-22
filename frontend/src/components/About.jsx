import React from 'react'
import aboutImg from "../assets/about.jpg"
import { MdFormatQuote, MdHome, MdContactMail } from 'react-icons/md'

const About = () => {
  return (
    <section className='max-padd-container py-16 xl:py-28'>
        <div className='flex flex-col xl:flex-row items-center justify-between gap-10'>
            <div className='flex-1 relative'>
                <img src={aboutImg} alt="About Us" className='rounded-3xl w-[488px]'/>
                  <div className='bg-white absolute bottom-16 left-16 shadow-md max-w-xs max-h-xs p-4 rounded-xl flexCenter flex-col'>
                    <span className='relative bottom-8 p-3 shadow-md bg-white h-12 w-12 rounded-full flex items-center'>
                        <MdFormatQuote className='text-2xl'/>
                    </span>
                    <p className='text-center relative bottom-3'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.strud exercitation ullamco laboris nisi ut aliquip ex ea commodo.
                    </p>     
                </div>
            </div>
            {/* Right Side*/}
            <di className='flex-1 flex justify-center flex-col'>
                <span className='medium-18'>
                    Extraordinary Homes For Extraordinary People
                </span>
                <h2 className='h2'>Envision A New Way Of Finding and Selling Premium Real Estate</h2>
                <p className='py-5'> 
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nobis delore expedita fugit, quidem, quos, quas quae voluptas quia quibusdam. 
                </p>
                <div className='flex flex-wrap gap-4'>
                    <button className='bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center'>
                        <MdHome className='mr-2' />
                        Add Home
                    </button>
                    <button className='bg-secondary hover:bg-secondary-dark text-white py-2 px-4 rounded-lg flex items-center'>
                        <MdContactMail className='mr-2' />
                        Contact
                    </button>
                </div>
            </di>
        </div>
    </section>
  )
}

export default About