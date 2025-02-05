import React from 'react'
import PropTypes from 'prop-types';
import FavButton from './FavButton'
import { MdOutlineBathtub, MdOutlineBed, MdOutlineGarage } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { CgRuler } from 'react-icons/cg'

const Item = ({ property }) => {
  
  const navigate = useNavigate();
  
  // Format price to Rands with 1000 separators
  const formatPrice = (price) => {
    return `R ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`;
  };

  // Improved facilities handling with better type checking and defaults
  const facilities = React.useMemo(() => {
    if (!property.facilities || !Array.isArray(property.facilities)) {
      return { bedrooms: 0, bathrooms: 0, parkings: 0 };
    }
    return property.facilities[0] || { bedrooms: 0, bathrooms: 0, parkings: 0 };
  }, [property.facilities]);

  return (
    <div 
      onClick={() => navigate(`../listings/${property.id}`)} 
      className='rounded-xl p-5 bg-white cursor-pointer' 
      key={property.id}
    >
        <div className='pb-2 relative'>
            <img src={property.image} alt={property.title} className='rounded-lg w-full'/>
              {/* Like Button */}
            <div className='absolute top-4 right-4'>
                <FavButton />
            </div>
        </div>
        <h5 className='bold-16 my-1 text-secondary'>{property.city}</h5>
        <h4 className='medium-18 line-clamp-1 '>{property.title}</h4>
        {/* Property Info */}
        <div className='flex gap-x-2 py-2'>
            <div className='flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]'><MdOutlineBed /> {Number(facilities?.bedrooms) || 0}</div>
            <div className='flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]'><MdOutlineBathtub /> {Number(facilities?.bathrooms) || 0}</div>
            <div className='flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]'><MdOutlineGarage /> {Number(facilities?.parkings) || 0}</div>
            <div className='flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]'><CgRuler/> {Number(property?.area) || 0}</div>
        </div>
        <p className='pt-2 mb-4 line-clamp-2'>{property.description}</p>
        <div className='block'>
            <div className='bold-20 xl:line-clamp-none'>{formatPrice(property.price)}</div>
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering parent onClick
                navigate(`../listings/${property.id}`);
              }}
              className='btn-secondary rounded-lg shadow-ms w-full mt-2'
            >
              View Property
            </button>
        </div>
    </div>
  )
}
Item.propTypes = {
  property: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    facilities: PropTypes.arrayOf(PropTypes.shape({
      bedrooms: PropTypes.number,
      bathrooms: PropTypes.number,
      parkings: PropTypes.number,
    })),
    area: PropTypes.number,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
  }).isRequired,
};

export default React.memo(Item); // Add memoization for performance
