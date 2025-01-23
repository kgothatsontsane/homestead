import React from 'react'
import { Link } from 'react-router-dom'
import { VscSettings } from 'react-icons/vsc'

const Properties = () => {
  return (
    <section>
        <div>
            <span>
                Your Dream Home Awaits
            </span>
            <h2>
                Discover Your Future Home
            </h2>
            <div>
                <h5><span>Showing 1-10</span> of 4k homes</h5>
                <Link to={'/'}><VscSettings/></Link>
            </div>
        </div>
    </section>
  )
}

export default Properties