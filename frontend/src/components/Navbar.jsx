import React from 'react'
import { NavLink } from 'react-router-dom'
import { MdHomeWork, MdViewQuilt, MdAddHome, MdContactSupport } from 'react-icons/md'
const Navbar = ({ containerStyles }) => {
    return (
        <nav className={`${containerStyles}`}>
            <NavLink to={"/"} className={({ isActive }) => isActive ? "active-link flexCenter gap-x-1 rounded-xl px-2 py-1.5" : "flexCenter gap-x-1 rounded-xl px-2 py-1.5"}>
                <MdHomeWork />
                <div>Welcome</div>
            </NavLink>
            <NavLink to={"/listings"} className={({ isActive }) => isActive ? "active-link flexCenter gap-x-1 rounded-xl px-2 py-1.5" : "flexCenter gap-x-1 rounded-xl px-2 py-1.5"}>
                <MdViewQuilt />
                <div>Listings</div>
            </NavLink>

            <NavLink to={"/add-property"} className={({ isActive }) => isActive ? "active-link flexCenter gap-x-1 rounded-xl px-2 py-1.5" : "flexCenter gap-x-1 rounded-xl px-2 py-1.5"}>
                <MdAddHome />
                <div>Add Home</div>
            </NavLink>


            <NavLink to={"/contact"} className={({ isActive }) => isActive ? "active-link flexCenter gap-x-1 rounded-xl px-2 py-1.5" : "flexCenter gap-x-1 rounded-xl px-2 py-1.5"}>
                <MdContactSupport />
                <div>Contact</div>
            </NavLink>
        </nav>
    )
}

export default Navbar