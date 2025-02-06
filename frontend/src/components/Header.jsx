/**
 * @fileoverview Header component with adaptive navigation and performance tracking
 * @module components/Header
 */
import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import { MdClose, MdMenu } from 'react-icons/md'

const userIcon = new URL('../assets/user.svg', import.meta.url).href

/**
 * Header Component
 * @component
 * @description Responsive header with navigation and user controls
 */
const Header = () => {
  const [active, setActive] = useState(false)
  const [menuOpened, setMenuOpened] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Performance monitoring for scroll events
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    setActive(currentScrollY > 50)
    setLastScrollY(currentScrollY)
  }, [])

  useEffect(() => {
    // Throttled scroll handler
    let ticking = false
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', scrollListener, { passive: true })
    return () => window.removeEventListener('scroll', scrollListener)
  }, [handleScroll])

  const toggleMenu = () => {
    setMenuOpened(prev => !prev)
    // Log interaction for analytics
    console.log('[Header] Menu toggled:', !menuOpened)
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className={`transition-all duration-300 bg-white shadow-sm
        ${active ? 'py-2' : 'py-4'}`}>
        <div className="max-padd-container">
          <div className="flexBetween">
            {/* Logo */}
            <Link to={"/"}>
              <span className="font-[900] text-[24px]">
                Home<span className="font-[600] text-[24px]">stead</span>
              </span>
            </Link>
            {/* Navigation bar */}
            <div className="flexCenter gap-x-4">
              {/* Desktop */}
              <Navbar
                containerStyles={
                  "hidden xl:flex gap-x-5 xl:gap-x-10  capitalize medium-15 ring-1 ring-slate-900/10 rounded-xl p-2 bg-primary/55 "
                }
              />
              {/* Mobile */}
              <Navbar
                containerStyles={`${
                  menuOpened
                    ? "flex items-start flex-col gap-y-8 capitalize fixed top-20 right-8 p-12 bg-white rounded-xl shadow-md w-64 medium-16 ring-1 ring-slate-900/5 transition-all duration-300 z-50"
                    : "flex items-start flex-col gap-y-8 capitalize fixed top-20 -right-[100%] p-12 bg-white rounded-2xl shadow-md w-64 medium-16 ring-1 ring-slate-900/5 transition-all duration-300 z-50"
                }`}
              />
            </div>
            {/* Buttons */}
            <div className="flexBetween gap-x-3 sm:gap-x-5 bold-16">
              {!menuOpened ? (
                <MdMenu
                  onClick={toggleMenu}
                  className="xl:hidden cursor-pointer text-3xl hover:text-secondary"
                />
              ) : (
                <MdClose
                  onClick={toggleMenu}
                  className="xl:hidden cursor-pointer text-3xl hover:text-secondary"
                />
              )}
              <button className="btn-secondary flexCenter gap-x-2 medium-16 rounded-xl">
                <img src={userIcon} alt="" height={22} width={22} />
                <span>Login</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header