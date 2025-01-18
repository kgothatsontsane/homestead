import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import { MdClose, MdMenu } from 'react-icons/md'
import userIcon from "../assets/user.svg"
const Header = () => {
    const [menuOpened, setMenuOpened] = useState(false)
    const toggleMenu = () => setMenuOpened(!menuOpened)
  return (
   <header className='max-padd-container fixed top-1 w-full left-0 right-0 z-[50]'>
        {/* Container */}
        <div className='max-padd-container transition-all duration-200 rounded-xl px-5 ring-1 ring-slate-900/5 '>
            <div className='flexBetween py-4 '>
                {/* Logo */}
                <Link to={"/"} >
                      <span className='font-[900] text-[24px]'>Home<span className='font-[600] text-[24px]'>stead</span></span>
                </Link>
                {/* Navigation bar */}
                <div className="flexCenter gap-x-4">
                    {/* Desktop */}
                    <Navbar containerStyles={"hidden xl:flex gap-x-5 xl:gap-x-10  capitalize medium-15 ring-1 ring-slate-900/10 rounded-xl p-2 bg-primary "}/>
                    {/* Mobile */}
                      <Navbar containerStyles={`${menuOpened ? "flex items-start flex-col gap-y-8 capitalize fixed top-20 right-8 p-12 bg-white rounded-xl shadow-md w-64 medium-16 ring-1 ring-slate-900/5 transition-all duration-300 z-50" : "flex items-start flex-col gap-y-8 capitalize fixed top-20 -right-[100%] p-12 bg-white rounded-2xl shadow-md w-64 medium-16 ring-1 ring-slate-900/5 transition-all duration-300 z-50"}`}/> 
                </div>
                {/* Buttons */}
                <div className='flexBetween gap-x-3 sm:gap-x-5 bold-16'>
                    {!menuOpened ? (<MdMenu onClick={toggleMenu} className='xl:hidden cursor-pointer text-3xl hover:text-secondary'/>) : (<MdClose onClick={toggleMenu} className='xl:hidden cursor-pointer text-3xl hover:text-secondary'/>)}
                    <button className='btn-secondary flexCenter gap-x-2 medium-16 rounded-xl'>
                          <img src={userIcon} alt='' height={22} width={22} /><span>Login</span>
                    </button>
                </div>
            </div>
        </div>
   </header>
  )
}

export default Header