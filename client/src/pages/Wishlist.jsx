import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ListingItem from "../components/ListingItem";

const Wishlist = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const removeFromWishlist = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/removeFromWishlist/${listingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser._id,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Handle successful removal, such as updating the UI
        // console.log("Listing removed from wishlist successfully!");
        // Fetch updated wishlist items after removal
        fetchWishlistItems();
      } else {
        // Handle failure, show an error message or take appropriate action
        // console.error(data.message);
        setError(data.message);
      }
    } catch (error) {
      // Handle fetch error
      //   console.error("Error removing listing from wishlist:", error.message);
      setError(data.message);
    }
  };

  const fetchWishlistItems = async () => {
    try {
      setLoading(true);

      // Fetch wishlist items using the new API endpoint
      const res = await fetch("/api/listing/myWishlist", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      setWishlistItems(data); // Update component state with wishlistItems
      setLoading(false);
      setError(false);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistItems();
  }, [currentUser]); // Run the effect whenever currentUser changes

  return (
    <div>
      {loading && (
        <p className="flex items-center justify-center pt-8">
          Loading wishlist items...
        </p>
      )}
      {error && (
        <p className="flex items-center justify-center pt-8">
          Error fetching wishlist items. {error}{" "}
        </p>
      )}
      {wishlistItems.length === 0 && !loading && !error && (
        <p className="flex items-center justify-center pt-8 ">
          No items in the wishlist.
        </p>
      )}
      {wishlistItems.length > 0 && (
        <div className="flex flex-wrap gap-4 p-4 items-center justify-center">
          {wishlistItems.map((listing) => (
            <div key={listing._id} className="flex flex-col items-center">
              <ListingItem listing={listing} />
              <button
                onClick={() => removeFromWishlist(listing._id)}
                className="bg-red-500 text-white rounded-lg uppercase hover:opacity-95 p-3 mt-2 w-full"
              >
                Remove from Wishlist
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
