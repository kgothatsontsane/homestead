import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
   <header>
        {/*container*/}
        <div>
            <div>
                {/*logo*/}
                <Link to={"/"} >
                      <span className='font-[900] text-[24px]'>Home<span className='font-[600] text-[24px]'>stead</span></span>
                </Link>
                {/*navigation bar*/}
                <div className=''>
                    {/*Desktop*/}
                </div>
            </div>
        </div>
   </header>
  )
}

export default Header