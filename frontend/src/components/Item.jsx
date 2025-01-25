import React from 'react'
import FavButton from './FavButton'
import { MdOutlineBathtub, MdOutlineBed, MdOutlineGarage } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { CgRuler } from 'react-icons/cg'

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
        <h5 className='bold-16 my-1 text-secondary'>{property.city}</h5>
        <h4 className='medium-18 line-clamp-1 '>{property.title}</h4>
        {/* Property Info */}
        <div className='flex gap-x-2 py-2'>
            <div className='flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]'><MdOutlineBed /> {property.facilities.bedrooms}</div>
            <div className='flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]'><MdOutlineBathtub /> {property.facilities.bathrooms}</div>
            <div className='flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]'><MdOutlineGarage /> {property.facilities.parkings}</div>
            <div className='flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]'><CgRuler/> {property.area}</div>
        </div>
        <p className='pt-2 mb-4 line-clamp-2'>{property.description}</p>
        <div className='block'>
            <div className='bold-20 xl:line-clamp-none'>{formatPrice(property.price)}</div>
            <Link to={`/`}>
                  <button className='btn-secondary rounded-lg shadow-ms w-full mt-2'>
                    View Property
                </button>
            </Link>
        </div>
    </div>
  )
}

export default Item