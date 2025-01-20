import React from 'react'
import aboutImg from "../assets/about.jpg"
import { MdFormatQuote } from 'react-icons/md'

const About = () => {
  return (
    <section>
        <div>
            <div>
                <img src={aboutImg} alt="About Us" className='rounded-xl rounded-t-[155px] w-[488px]'/>
                <div>
                    <span>
                        <MdFormatQuote className='text-2xl'/>
                        <span>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                                <h3>John Doe</h3>
                                <p>CEO</p>
                        </span>
                    </span>
                </div>
            </div>
        </div>
    </section>
  )
}

export default About