import React from 'react'
import { NavLink } from 'react-router-dom'
import { MdHomeWork, MdOutlineListAlt, MdAddHome } from 'react-icons/md'

const Navbar = () => {
  return (
    <nav className="hidden md:flex gap-x-4">
        <NavLink to={"/"} className={({ isActive })=> isActive ? "active-link flexCenter gap-x-1 rounded-xl px-2 py-1" : "flexCenter gap-x-1 rounded-2xl px-2 py-1"}>
        <MdHomeWork />
        <div>Home</div>
        </NavLink>
        <NavLink to={"/listings"} className={({ isActive }) => isActive ? "active-link flexCenter gap-x-1 rounded-xl px-2 py-1" : "flexCenter gap-x-1 rounded-md px-2 py-1"}>
        <MdOutlineListAlt />
        <div>Listings</div>
        </NavLink>
        <NavLink to={"add-property"} className={({ isActive }) => isActive ? "active-link flexCenter gap-x-1 rounded-xl px-2 py-1" : "flexCenter gap-x-1 rounded-md px-2 py-1"}>
        <MdAddHome />
        <div>Add Property</div>
        </NavLink>
    </nav>
  )
}

export default Navbar