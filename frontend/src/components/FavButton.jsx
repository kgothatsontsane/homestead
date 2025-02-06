/**
 * @fileoverview Favorite button component with animation and state management
 * @module components/FavButton
 */
import React, { useState, useCallback } from 'react'
import { FaHeart } from 'react-icons/fa6'
import { motion } from 'framer-motion'

const FavButton = () => {
  const [isFavorite, setIsFavorite] = useState(false)

  const handleFavorite = useCallback((e) => {
    e.stopPropagation()
    setIsFavorite(prev => !prev)
  }, [])

  return (
    <motion.div
      whileTap={{ scale: 0.9 }}
      onClick={handleFavorite}
    >
      <FaHeart 
        size={22} 
        className={`cursor-pointer drop-shadow-md transition-colors duration-300
          ${isFavorite ? 'text-red-500' : 'text-white hover:text-red-400'}`}
      />
    </motion.div>
  )
}

export default React.memo(FavButton)