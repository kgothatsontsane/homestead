import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className='max-padd-container pt-[99px]'>
        <div className='max-padd-container bg-hero bg-center ng-cover bg-no-repeat h-[655px] w-full rounded-xl items-center'>
            <div className='relative top-32 xs:top-52'>
                <span className='medium-18'>Welcome to Homestead</span>
                <h1 className='h1 capitalize max-w-[40rem]'>Discover Your Dream Home With Homestead</h1>
                <p className='my-10 max-w-[33rem] text-slate-900 bg-cyan-200/60 rounded-xl pt-1 pb-1 pr-4 pl-4'> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Non rerum dolorum cumque magni rem illo quia, autem porro excepturi, quidem commodi ad perferendis culpa.
                </p>
                {/* View Listings Button */}
                <div className='inline-flex items-center justify-center gap-4 p-2 bg-white rounded-xl'>
                    <div className='text-center regular-14 leading-tight pl-5'>
                        <h5>Valuation Report</h5>
                        <p>On All Properties</p>
                    </div>
                    <Link to="/listings">View Homes</Link>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Hero