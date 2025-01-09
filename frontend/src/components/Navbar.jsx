import React from 'react'
import { NavLink } from 'react-router-dom'
import { MdHomeWork, MdOutlineListAlt, MdAddHome, MdOutlineAddHome, MdOutlineHomeWork, MdListAlt } from 'react-icons/md'

const Navbar = ({ containerStyles }) => {
  return (
    <nav className={`${containerStyles}`}>
        <NavLink to={"/"} className={({ isActive })=> isActive ? "active-link flexCenter gap-x-1 rounded-xl px-2 py-1" : "flexCenter gap-x-1 rounded-md px-2 py-1"}>
        <MdHomeWork />
        <div>Welcome</div>
        </NavLink>
        <NavLink to={"/listings"} className={({ isActive }) => isActive ? "active-link flexCenter gap-x-1 rounded-xl px-2 py-1" : "flexCenter gap-x-1 rounded-md px-2 py-1"}>
        <MdListAlt />
        <div>Listings</div>
        </NavLink>
        
        <NavLink to={"/listings"} className={({ isActive }) => isActive ? "active-link flexCenter gap-x-1 rounded-xl px-2 py-1" : "flexCenter gap-x-1 rounded-md px-2 py-1"}>
        <MdAddHome />
        <div>Add Home</div>
        </NavLink>
        
        
        <NavLink to={"add-property"} className={({ isActive }) => isActive ? "active-link flexCenter gap-x-1 rounded-xl px-2 py-1" : "flexCenter gap-x-1 rounded-md px-2 py-1"}>
        <MdContactSupport />
        <div>Contact</div>
        </NavLink>
    </nav>
  )
}

export default Navbar