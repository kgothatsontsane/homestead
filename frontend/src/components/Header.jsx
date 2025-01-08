import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'

const Header = () => {
  return (
   <header className='max-padd-container fixed top-1 w-full left-0 right-0 z-[50]'>
        {/*container*/}
        <div className='max-padd-container transition-all duration-200 rounded-3xl px-5 ring-1 ring-slate-900/5 '>
            <div className='flexBetween py-4 '>
                {/*logo*/}
                <Link to={"/"} >
                      <span className='font-[900] text-[24px]'>Home<span className='font-[600] text-[24px]'>stead</span></span>
                </Link>
                {/*navigation bar*/}
                <div className=''>
                    {/*Desktop*/}
                    <Navbar />
                    {/*Mobile*/}
                    <Navbar />
                </div>
                {/*buttons*/}
                <div>
                    buttons and icons
                </div>
            </div>
        </div>
   </header>
  )
}

export default Header