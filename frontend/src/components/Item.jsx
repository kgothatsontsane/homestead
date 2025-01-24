import React from 'react'
import FavButton from './FavButton'
import { MdOutlineBathtub, MdOutlineBed, MdOutlineGarage } from 'react-icons/md'
import { Link } from 'react-router-dom'

const Item = ({ property }) => {
  const formatPrice = (price) => {
    return `R ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`;
  };

  return (
    <div className='rounded-xl p-5 bg-white'>
        <div className='pb-2 relative'>
            <img src={property.image} alt={property.title} className='rounded-lg w-full'/>
              {/* Like Button */}
            <div className='absolute top-4 right-4'>
                <FavButton />
            </div>
        </div>
        <h5 className='bold-16 my-1 '>{property.city}</h5>
        <h4>{property.title}</h4>
        {/* Property Info */}
        <div className='flex gap-x-2 py-2'>
            <div className='flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]'><MdOutlineBed /> {property.facilities.bedTubMdOutlineBathtubs}</div>
            <div className='flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]'><MdOutlineBathtub /> {property.facilities.bathTubMdOutlineBathtubs}</div>
            <div className='flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]'><MdOutlineGarage /> {property.facilities.parkkings}</div>
        </div>
        <p>{property.description}</p>
        <div className='flexBetween'>
            <div>{formatPrice(property.price)}</div>
            <Link to={`/property/${property.title}`} className='btn-secondary !py-2 !px-4 rounded-xl shadow-ms'>View Property</Link>
        </div>
    </div>
  )
}

export default Item