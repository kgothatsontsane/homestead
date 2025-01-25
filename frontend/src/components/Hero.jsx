import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className="max-padd-container pt-[99px]">
      <div className="max-padd-container bg-hero bg-center bg-cover bg-no-repeat h-[655px] w-full rounded-xl items-center">
        <div className="relative top-32 xs:top-52">
          <span className="medium-18">Welcome to Homestead</span>
          <h1 className="h1 capitalize max-w-[40rem]">
            Discover Your Dream Home With Homestead
          </h1>
          <p className="my-10 max-w-[32rem] bg-cyan-300/60 text-slate-900 rounded-xl p-2  pl-4">
            We are dedicated to providing you with a superior real estate experience.<br></br>
            Explore a wide range of properties tailored to your needs.<br></br>
            Find your perfect home with ease and confidence.
          </p>
          {/* View Listings Button */}
          <div className="inline-flex items-center justify-center gap-4 p-2 bg-white rounded-xl">
            <div className="text-center regular-14 leading-tight pl-5">
              <h5 className="uppercase font-bold">Free Valuation Report</h5>
              <p className="regular-14 text-slate-600">
                On All Of Our Properties
              </p>
            </div>
            <Link
              to="/listings"
              className="btn-secondary rounded-xl flexCenter !py-5"
            >
              View Properties
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero