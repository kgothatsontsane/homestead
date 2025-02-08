import React from 'react'
import { NavLink } from 'react-router-dom'
import { MdHomeWork, MdViewQuilt, MdAddHome, MdContactSupport } from 'react-icons/md'
import PropTypes from 'prop-types'

const Navbar = ({ containerStyles }) => {
    const navLinkClasses = ({ isActive }) => 
        `flexCenter gap-x-1 rounded-lg px-4 py-2 transition-colors duration-200 ${
            isActive 
                ? 'bg-secondary text-white' 
                : 'hover:bg-gray-100'
        }`;

    return (
        <nav className={`${containerStyles}`}>
            <NavLink to={"/"} className={navLinkClasses}>
                <MdHomeWork className="text-xl" />
                <div>Welcome</div>
            </NavLink>

            <NavLink to={"/listings"} className={navLinkClasses}>
                <MdViewQuilt className="text-xl" />
                <div>Listings</div>
            </NavLink>

            <NavLink to={"/add-property"} className={navLinkClasses}>
                <MdAddHome className="text-xl" />
                <div>Add Home</div>
            </NavLink>

            <NavLink to={"/contact"} className={navLinkClasses}>
                <MdContactSupport className="text-xl" />
                <div>Contact</div>
            </NavLink>
        </nav>
    )
}

Navbar.propTypes = {
    containerStyles: PropTypes.string.isRequired,
}

export default Navbar