import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
  const navigate = useNavigate();

  const [filterOptions, setFilterOptions] = useState({
    searchTerm: "",
    type: "all",
    furnished: false,
    parking: false,
    solar: false,
    pets: false,
    offer: false,
    appartment: false,
    sort: "created_at",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  // console.log(listings);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const solarFromUrl = urlParams.get("solar");
    const petsFromUrl = urlParams.get("pets");
    const appartmentFromUrl = urlParams.get("appartment");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    //if any of the filter fields changes we will update the state
    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      solarFromUrl ||
      petsFromUrl ||
      appartmentFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setFilterOptions({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        pets: petsFromUrl === "true" ? true : false,
        solar: solarFromUrl === "true" ? true : false,
        appartment: appartmentFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListing = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/getListings?${searchQuery}`); //this will get all the listings based on the query filters provided to it.
      const data = await res.json();
      if (data.length > 5) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListing(); //we are calling this function again here because we can't make the callback of useEffect as async. So we make this function async and then call it again.
  }, [location.search]); //we are doing this to get any existing url parameters from the search query

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setFilterOptions({ ...filterOptions, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setFilterOptions({ ...filterOptions, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer" ||
      e.target.id === "solar" ||
      e.target.id === "pets" ||
      e.target.id === "appartment"
    ) {
      setFilterOptions({
        ...filterOptions,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      }); //we will change the correponding checkboxes of the id selected and we are keeping two conditions "e.target.checked || e.target.checked==='true'" because the value can be boolean or string and we dont want to get errors.
    }

    if (e.target.id === "sort_order") {
      //we are putting both sort and order in the id of the select options hence we are splitting them
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc"; //if value is there then its okay, else we will keep the default values
      setFilterOptions({ ...filterOptions, sort, order });
    }
  };

  // console.log(filterOptions);

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();
    //we will first get if any existing parameter is present in the url

    urlParams.set("searchTerm", filterOptions.searchTerm);
    urlParams.set("type", filterOptions.type);
    urlParams.set("parking", filterOptions.parking);
    urlParams.set("furnished", filterOptions.furnished);
    urlParams.set("offer", filterOptions.offer);
    urlParams.set("solar", filterOptions.solar);
    urlParams.set("pets", filterOptions.pets);
    urlParams.set("appartment", filterOptions.appartment);
    urlParams.set("sort", filterOptions.sort);
    urlParams.set("order", filterOptions.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings; //we will use the existing data length as the starting index to find the next data to be shown
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/getListings?${searchQuery}`);
    const data = await res.json();
    if (data.length < 6) {
      setShowMore(false);
    }
    setListings([...listings, ...data]); //data is also an array. we are appends the new data array to the existing listings array. hence, we are using the spread operator
  };

  return (
    <div className=" flex flex-col md:flex-row">
      <div className="sm:w-1/3  p-7  border-b-2 sm:border-r-2">
        <form
          onSubmit={handleSubmit}
          className="flex sm:pt-20 flex-col gap-8 sm:fixed"
        >
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={filterOptions.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                checked={filterOptions.type === "all"}
                onChange={handleChange}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                checked={filterOptions.type === "rent"}
                onChange={handleChange}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                checked={filterOptions.type === "sale"}
                onChange={handleChange}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                checked={filterOptions.offer}
                onChange={handleChange}
              />
              <span>Offer</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="appartment"
                className="w-5"
                checked={filterOptions.appartment}
                onChange={handleChange}
              />
              <span>Appartment</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                checked={filterOptions.furnished}
                onChange={handleChange}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                checked={filterOptions.parking}
                onChange={handleChange}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="solar"
                className="w-5"
                checked={filterOptions.solar}
                onChange={handleChange}
              />
              <span>Solar</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="pets"
                className="w-5"
                checked={filterOptions.pets}
                onChange={handleChange}
              />
              <span>Pets</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1  overflow-y-auto p-7">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">No listing found!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}
          {/* //its not loading and listings are present */}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          {showMore && (
            <button
              className="text-green-700 hover:underline p-7 font-semibold text-center w-full "
              onClick={onShowMoreClick}
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
