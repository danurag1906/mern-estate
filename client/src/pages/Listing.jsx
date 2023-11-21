import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaSolarPanel,
  FaPaw,
  FaBuilding,
} from "react-icons/fa";
import Contact from "../components/Contact";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contactButton, setContactButton] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        // console.log("try");
        const res = await fetch(`/api/listing/getListing/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          //   console.log("failed");
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        // console.log(data.name);
        // console.log(listing.name);
        // console.log("data : " + data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, []);
  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl"> Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat `,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - Rs.{" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-IN")
                : listing.regularPrice.toLocaleString("en-IN")}
              {listing.type === "rent" && "/ month"}
            </p>
            <p className="flex items-center mt-2 gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  Rs. {+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <ul className="text-green-900 font-semibold flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-2 whitespace-nowrap ">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap ">
                <FaBed className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking Spot " : "No parking"}
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Not Furnished"}
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap ">
                <FaSolarPanel className="text-lg" />
                {listing.solar ? "Solar" : "No solar"}
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap ">
                <FaPaw className="text-lg" />
                {listing.pets ? "Pet Friendly" : "No Pets"}
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap ">
                <FaBuilding className="text-lg" />
                {listing.appartment ? "Appartment" : "Individual"}
              </li>
            </ul>
            {/* if current user is logged in or the listing is made by current user we wont him the contact owner button . if contact button is clicked then also we wont show this button button we show send email or message button */}
            {currentUser &&
              currentUser._id !== listing.userRef &&
              !contactButton && (
                <button
                  onClick={() => setContactButton(true)}
                  className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
                >
                  Contact Landlord
                </button>
              )}
            {/* if contact button is clicked we will show the user the below contact component */}
            {contactButton && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}
