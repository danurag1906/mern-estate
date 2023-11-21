import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import ListingItem from "../components/ListingItem";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [appartmentListings, setAppartmentListings] = useState([]);
  SwiperCore.use([Navigation]);
  // console.log(appartmentListings);
  // console.log(offerListings + "offer");

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/getListings?offer=true&limit=3");
        const data = await res.json();
        // console.log(data);
        setOfferListings(data);
        fetchRentListings(); //we are calling this function after getting the data for offer listings , so as to not give load on the data base. If we call all the rent, salem offer etc functions at the same time then it will cause heavy loading.
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/getListings?type=rent&limit=3");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/getListings?type=sale&limit=3");
        const data = await res.json();
        setSaleListings(data);
        fetchAppartmentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchAppartmentListings = async () => {
      try {
        const res = await fetch(
          "/api/listing/getListings?appartment=true&limit=3"
        );
        const data = await res.json();
        setAppartmentListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div>
      {/*top*/}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your dream <span className="text-slate-500">house</span>
          <br />
          with ease{" "}
        </h1>
        <div className="text-gray-500 text-xs sm:text-lg">
          Finding Estate will help you find your home fast, easy and
          comfortable.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={"/search"}
          className="text-xs sm:text-lg text-blue-800 font-bold hover:underline"
        >
          Let's start now...
        </Link>
      </div>

      {/*swiper*/}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat `,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/*listing results for offer, slae,rent and appartments*/}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600 ">
                Recent Offers
              </h2>
              <Link
                className="text-md text-blue-800 hover:underline"
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600 ">
                Recent places for rent
              </h2>
              <Link
                className="text-md text-blue-800 hover:underline"
                to={"/search?type=rent"}
              >
                Show more places for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600 ">
                Recent places for sale
              </h2>
              <Link
                className="text-md text-blue-800 hover:underline"
                to={"/search?type=sale"}
              >
                Show more places for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {appartmentListings && appartmentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600 ">
                Recent places for appartments
              </h2>
              <Link
                className="text-md text-blue-800 hover:underline"
                to={"/search?appartment=true"}
              >
                Show more places for appartments
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {appartmentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
