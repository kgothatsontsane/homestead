import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="hidden md:flex gap-x-4">
        <NavLink to={"/"} className="text-slate-900 hover:text-slate-700">Home
        </NavLink>
        <a href="/listings" className="text-slate-900 hover:text-slate-700">Listings</a>
        <a href="/add-property" className="text-slate-900 hover:text-slate-700">Add Property</a>
        <a href="/bookings" className="text-slate-900 hover:text-slate-700">Bookings</a>
        <a href="/favourites" className="text-slate-900 hover:text-slate-700">Favourites</a>
    </nav>
  )
}

export default Navbar