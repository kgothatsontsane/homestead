import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useEffect, useCallback } from "react";
import { getProperty } from '../utils/api';
import { PuffLoader } from "react-spinners";
import FavButton from "../components/FavButton";
import {MdOutlineBathtub, MdOutlineBed, MdOutlineGarage} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { CgRuler } from "react-icons/cg";
const Property = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const id = pathname.split("/").slice(-1)[0];

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["property", id],
    queryFn: () => getProperty(id),
  });

  const logState = useMemo(() => {
    let errorMessage = "";
    if (isError) {
      errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown error occurred while fetching property";
    }
    return {
      hasData: Boolean(data),
      dataLength: data?.length,
      isError,
      isLoading,
      errorMessage,
      renderTime: `${performance.now()}ms`,
    };
  }, [data, isError, isLoading, error]);

  // Format price to Rands with 1000 separators
  const formatPrice = (price) => {
    return `R ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`;
  };

  // Improved facilities handling with better type checking and defaults
  const facilities = React.useMemo(() => {
    if (!data?.facilities || !Array.isArray(data?.facilities)) {
      return { bedrooms: 0, bathrooms: 0, parkings: 0 };
    }
    return data?.facilities[0] || { bedrooms: 0, bathrooms: 0, parkings: 0 };
  }, [data?.facilities]);

  useEffect(() => {
    console.log("[Property] Component state:", logState);
  }, [logState]);

  useEffect(() => {
    if (isError) {
      console.error("[Property] Error fetching property:", error);
    }
  }, [isError, error]);

  useEffect(() => {
    if (isLoading) {
      console.log("[Property] Loading property...");
    }
  }, [isLoading]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  };

  /*  const propertyList = useMemo(() => {
    if (!data) return [];
    return data
      .filter(property => property !== null)
      .map((property) => (
        <Item 
          key={property._id || property.title} 
          property={{
            ...property,
            area: property.area || 0
          }} 
        />
      ));
  }, [data]);
*/

  // Show loading state if data is not yet available or loading
  if (isLoading || !data) {
    return (
      <main>
        <div className="flex justify-center items-center h-screen">
          <PuffLoader
            size={60}
            color={"#123abc"}
            loading={true}
            aria-label="puff-loading"
          />
        </div>
      </main>
    );
  }

  // After all hooks, we can have conditional returns
  if (isError) {
    return (
      <main>
        <div className="max-padd-container my-[99px]">
          <div className="max-padd-container py-10 xl:py-22 bg-primary rounded-xl">
            <h1 className="text-2xl text-center">
              An error occurred while the property
            </h1>
          </div>
        </div>
      </main>
    );
  }

  return (
    <section className="max-padd-container my-[99px]">
      <div className="pb-2 relative">
        <img
          src={getImageUrl(data?.image)}
          alt={data?.title}
          className="rounded-lg max-h-[27rem] self-center w-full object cover"
        />
        {/* Like Button */}
        <div className="absolute top-4 right-4">
          <FavButton />
        </div>
      </div>
      {/* Container */}
      <div>
        <h5 className="bold-16 my-1 text-secondary">{data?.city}</h5>
        <h4 className="medium-18 line-clamp-1 ">{data?.title}</h4>
        {/* Property Info */}
        <div className="flex gap-x-2 py-2">
          <div className="flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]">
            <MdOutlineBed /> {Number(facilities?.bedrooms) || 0}
          </div>
          <div className="flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]">
            <MdOutlineBathtub /> {Number(facilities?.bathrooms) || 0}
          </div>
          <div className="flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]">
            <MdOutlineGarage /> {Number(facilities?.parkings) || 0}
          </div>
          <div className="flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]">
            <CgRuler /> {Number(data?.area) || 0}
          </div>
        </div>
        <p className="pt-2 mb-4 line-clamp-2">{data?.description}</p>
        <div className="block">
          <div className="bold-20 xl:line-clamp-none">
            {formatPrice(data?.price)}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering parent onClick
              navigate(`../listings/${data?.id}`);
            }}
            className="btn-secondary rounded-lg shadow-ms w-full mt-2"
          >
            View Property
          </button>
        </div>
      </div>
    </section>
  );
}

export default Property