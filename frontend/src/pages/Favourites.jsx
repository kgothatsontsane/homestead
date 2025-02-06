/**
 * @fileoverview Favourites page for saved properties
 * @module pages/Favourites
 */
import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { PuffLoader } from 'react-spinners'

/**
 * Favourites Component
 * @component
 * @description Displays user's saved/favorited properties
 */
const Favourites = () => {
  const [isLoading, setIsLoading] = useState(true)
  const pageLoadTime = useRef(performance.now())

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    console.log('[Favourites] Load time:', performance.now() - pageLoadTime.current)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PuffLoader size={60} color={"#123abc"} />
      </div>
    )
  }

  return (
    <main className="max-padd-container my-[99px]">
      <motion.div 
        className="max-padd-container bg-primary rounded-xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-6">Your Favourite Properties</h1>
        {/* Favourites grid implementation coming soon */}
      </motion.div>
    </main>
  )
}

export default Favourites