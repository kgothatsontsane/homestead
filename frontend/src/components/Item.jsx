import React from 'react'

const Item = ({ property }) => {
  return (
    <div>
        <div>
            <img src={property.image} alt={property.title} className='rounded-xl w-full'/>
              {/* Like Button */}
            <div>
                <Fvo 
            </div>
        </div>
    </div>
  )
}

export default Item