import React from 'react'
import aboutImg from "../assets/about.jpg"
import { MdFormatQuote, MdAddHome, MdContactSupport } from 'react-icons/md'

const About = () => {
    return (
        <section className='max-padd-container py-16 xl:py-28 bg-gray-100'>
            <div className='flex flex-col xl:flex-row items-center justify-between gap-10 bg-white shadow-lg rounded-3xl p-10'>
                <div className='flex-1 relative'>
                    <img src={aboutImg} alt="About Us" className='rounded-3xl w-[488px]'/>
                    <div className='bg-white absolute xl:bottom-16 bottom-6 left-16 pr-3 mr-12 shadow-md max-w-xs p-4 rounded-xl flexCenter flex-col'>
                        <span className='relative bottom-8 p-3 shadow-md bg-white h-12 w-12 rounded-full flex items-center'>
                            <MdFormatQuote className='text-2xl'/>
                        </span>
                        <p className='text-center relative bottom-3'>
                            &quot;Real estate is not just about property, it&apos;s about people.&quot;
                        </p>
                        <h3 className='text-center text-lg'>Walt Disney</h3>
                    </div>
                </div>
                {/* Right Side*/}
                <div className='flex-1 flex justify-center flex-col'>
                    <span className='medium-18'>
                        
                    </span>
                    <h2 className='h2'>Envision A New Way Of Finding and Selling Premium Real Estate</h2>
                    <p className='py-5'> 
                        We provide a seamless experience for buyers and sellers, ensuring that every transaction is smooth and successful. Our team of experts is dedicated to helping you find the perfect home or sell your property at the best price. Trust us to guide you through the process with professionalism and care.
                    </p>
                    <p className='bg-primary/20 rounded-lg p-5'>
                        Our mission is to redefine the real estate experience by offering unparalleled service and expertise. We believe in building lasting relationships with our clients, and we are committed to exceeding your expectations at every step of the journey.
                    </p>
                    <div className='flex flex-wrap gap-4 flex-col xl:flex-row pt-7'>
                        <button className='bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center mb-4 xl:mb-0 xl:mr-4'>
                            <MdAddHome className='mr-2' />
                            Add My Home
                        </button>
                        <button className='bg-secondary hover:bg-secondary-dark text-white py-2 px-4 rounded-lg flex items-center'>
                            <MdContactSupport className='mr-2' />
                            Contact Us
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About
