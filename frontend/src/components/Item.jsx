import React from 'react'
import FavButton from './FavButton'
import { MdOutlineBed } from 'react-icons/md'

const Item = ({ property }) => {
  return (
    <div>
        <div>
            <img src={property.image} alt={property.title} className='rounded-xl w-full'/>
              {/* Like Button */}
            <div className='absolute top-4 right-4'>
                <FavButton />
            </div>
        </div>
        <h5>{property.city}</h5>
        <h4>{property.title}</h4>
        {/* Property Info */}
        <div className='flex gap-2 py-2'>
            <div className='flexCenters gap-x-2 border-r border-slate-900/50 pr-4 font-[500]'><MdOutlineBed /> {property.facilities.bedrooms}</div>
        </div>
    </div>
  )
}

export default Item