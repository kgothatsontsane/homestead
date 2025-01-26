import React from 'react'
import { Link } from 'react-router-dom'
import { FOOTER_CONTACT_INFO, FOOTER_LINKS, SOCIALS } from '../constant/data'

const Footer = () => {
  return (
    <footer className="max-padd-container mb-4">
      <div className="max-padd-container bg-primary rounded-t-xl pt-12 xl:pt-20 pb-8">
        <h3 className="h3">Ready to explore our curated properties?</h3>
        <p>
          Are you ready to discover the finest properties tailored to your exquisite taste and lifestyle?
        </p>
        <hr className="my-8 bg-slate-900/30 h-[2px]" />
        {/* Content Container */}
        <div className="flex justify-between flex-wrap gap-x-2 gap-y-8">
          <di className="max-w-sm">
            <Link to="/" className="flex items-center gap-x-2">
              <span className="font-[900] text-[24px]">
                Home<span className="font-[600] text-[24px]">stead</span>
              </span>
            </Link>
            <p className="py-4">
              Explore our curated listings to find your dream home.<br></br> Our team is dedicated to providing you with the best real estate experience at your fingertips.
            </p>
            <div className="flexBetween pl-6 h-[3.3rem] bg-white w-full max-w-[366px] rounded-xl ring-1 ring-slate-500/5">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent border-none outline-none"
              />
              <button className="btn-secondary rounded-xl relative right-[0.22rem]">
                Subscribe
              </button>
            </div>
          </di>
          <div className="flex justify-between flex-wrap gap-8">
            {FOOTER_LINKS.map((col) => (
              <FooterColumn key={col.title} title={col.title}>
                <ul className="flex flex-col gap-4 regular text-gray-20">
                  {col.links.map((link) => (
                      <Link to="/" key={link}>{link}</Link>
                  ))}
                </ul>
              </FooterColumn>
            ))}
            <div>
              <FooterColumn title={FOOTER_CONTACT_INFO.title}>
                {FOOTER_CONTACT_INFO.links.map((link) => (
                  <Link to={'/'} key={link.label} className='flex gap-4 md:flex-col lg:flex-row'>
                    <p>{link.label}</p>:<p>{link.value}</p>
                  </Link>
                ))}
              </FooterColumn>
            </div>
            <div className='flex'>
              <FooterColumn title={SOCIALS.title}>
                <ul className="flex gap-4">
                  {SOCIALS.links.map((link) => (
                    <li key={link.id}>
                      <Link to={"/"} key={link.id} className='text-xl'>{link.icon}</Link>
                    </li>
                  ))}
                </ul>
              </FooterColumn>
            </div>
          </div>
        </div>
      </div>
      {/* Copyright */}
      <p className='text-white bg-tertiary medium-14 py-2 px-2 rounded-b-xl flexBetween'>
        <span>&copy; 2025 Homestead</span> All rights reserved
      </p>
    </footer>
  );
}

export default Footer

const FooterColumn = ({ title, children }) => {
  return (
    <div className='flex flex-col gap-5'>
      <h4 className='bold-18 whitespace-nowrap'>{title}</h4>
      {children}
    </div>
  )
}