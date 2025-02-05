import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { VscSettings } from 'react-icons/vsc'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import Item from '../components/Item'
import useProperties from '../hooks/useProperties'
import { PuffLoader } from 'react-spinners'

const Properties = () => {
  const { data, isLoading, isError } = useProperties()

  // Memoize the filtered and processed properties
  const processedProperties = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data
      .filter(property => property && property.facilities)
      .map(property => ({
        ...property,
        facilities: Array.isArray(property.facilities) ? property.facilities : [],
        area: property.area || 0
      }));
  }, [data]);

  // Memoize the Swiper content
  const swiperContent = useMemo(() => (
    processedProperties.map((property) => (
      <SwiperSlide key={property._id || property.title}>
        <Item property={property} />
      </SwiperSlide>
    ))
  ), [processedProperties]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <PuffLoader size={60} color={"#123abc"} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-padd-container py-16">
        <h3 className="text-center text-red-500">Failed to load properties</h3>
      </div>
    );
  }

  return (
    <section className="max-padd-container">
      <div className="max-padd-container bg-primary py-16 xl:py-28 rounded-3xl">
        <span className="medium-18">Your Dream Home Awaits</span>
        <h2 className="h2 capitalize">Discover Your Future Home</h2>
        <div className="flexBetween mt-8 mb-6">
          <h5>
            <span className="font-bold">Showing {processedProperties.length} properties</span>
          </h5>
          <Link
            to={"/listings"}
            className="bg-white text-3xl rounded-md h-10 w-10 p-1 border"
          >
            <VscSettings />
          </Link>
        </div>
        
        <Swiper
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            600: { slidesPerView: 2, spaceBetween: 30 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
            1300: { slidesPerView: 4, spaceBetween: 30 },
          }}
          modules={[Autoplay]}
          className="h-[488px] md:h-[533px] lg:h-[422px] mt-5"
        >
          {swiperContent}
        </Swiper>
      </div>
    </section>
  );
};

export default React.memo(Properties);